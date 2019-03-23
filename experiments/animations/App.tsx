import * as React from "react";

import Badge1Animation from "./Badge1Animation";
import Logo1Animation from "./Logo1Animation";
import Logo2Animation from "./Logo2Animation";
import LogoFadeScaleAnimation from "./LogoFadeScaleAnimation";

const logo1 = {
  parent: null,
  title: "Draw letters 1",
  description: "Fade-in and stroke Bladerunner logo letters, then fade in the 'swish'.",
  component: Logo1Animation,
};

const logo2 = {
  parent: null,
  title: "Draw letters 2",
  description: "Fade-in white Bladerunner logo letters on black background, then fade in the 'swish'.",
  component: Logo2Animation,
};

const logoFadeScaleAnimation = {
  parent: null,
  title: "Whole logo fade-in/scale-up",
  description: "Fade-in and scale-up whole logo.",
  component: LogoFadeScaleAnimation,
};

const badge1 = {
  parent: null,
  title: "Badge 1",
  description: "Badge 1",
  component: Badge1Animation,
};

const anims = [
  logo1,
  logo2,
  logoFadeScaleAnimation,
  badge1,
];

export default function App() {
  const [currentAnim, setCurrentAnim] = React.useState(null);
  const [fill, setFill] = React.useState(false);
  const [reRenderToken, setReRenderToken] = React.useState(+new Date());
  const animationRef = React.useRef<HTMLDivElement>();
  const svg = animationRef.current && animationRef.current.querySelector("svg");

  React.useEffect(() => {
    console.log("effect", animationRef.current, fill, svg, currentAnim);
    if (svg) {
      svg.classList[fill ? "add" : "remove"]("fill-background");
    }
  }, [fill, currentAnim, svg]);

  const onChangeAnimation = (e) => {
    // -1 because of blank row
    const animIdx = e.target.selectedIndex - 1;
    if (animIdx >= 0) {
      setCurrentAnim(anims[animIdx]);
    }
  };

  const onChangeFillBackground = (e) => setFill(e.target.checked);

  const onClickRun = (e) => setReRenderToken(+new Date());

  return (
    <div id="app">
      <style>
        {`
  .fill-background {
    background: lightgoldenrodyellow;
  }

  .anim-container {
    margin-top: 1em;
  }
  `
        }
      </style>
      <h2>Animations</h2>
      <div>
        <div>
          <label>Animation:&nbsp;
            <select onChange={onChangeAnimation}>
              {[{ title: "" }].concat(anims).map(
                ({ title }, i) => <option key={i} value={i}>{title}</option>
              )}
            </select>
          </label>
        </div>
        <div>
          <label>Fill SVG background:
          <input type="checkbox" onChange={onChangeFillBackground} checked={fill} />
          </label>
        </div>
      </div>
      {currentAnim && (
        <div ref={animationRef}>
          <h3><button onClick={onClickRun}>Run</button> {currentAnim.title}</h3>
          <div>{currentAnim.description}</div>
          <currentAnim.component id="anim" reRenderToken={reRenderToken} />
        </div>
      )}
    </div>
  );
}
