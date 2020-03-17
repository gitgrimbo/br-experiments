import * as React from "react";

import Logo1Animation from "./Logo1Animation";
import Badge1Animation from "./Badge1Animation";

const logo1 = {
  parent: null,
  title: "Draw letters 1",
  description: "Draw Bladerunner logo letters then fade in the 'swish'.",
  component: Logo1Animation,
};

const badge1 = {
  parent: null,
  title: "Badge 1",
  description: "Badge 1",
  component: Badge1Animation,
};

const anims = [
  logo1,
  badge1,
];

export default function App() {
  const [currentAnim, setCurrentAnim] = React.useState(null);
  const [fill, setFill] = React.useState(false);
  const [reRenderToken, setReRenderToken] = React.useState(+new Date());
  const animationRef = React.useRef<HTMLElement>();
  const svg = animationRef.current && animationRef.current.querySelector("svg");

  React.useEffect(() => {
    console.log("effect", animationRef.current, fill, currentAnim);
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
        <label>Animation:
          {" "}
          <select onChange={onChangeAnimation}>
            {[{ title: "" }].concat(anims).map(
              ({ title }, i) => <option key={i} value={i}>{title}</option>
            )}
          </select>
        </label>
        {" "}
        <label>Fill SVG background:
          <input type="checkbox" onChange={onChangeFillBackground} checked={fill} />
        </label>
      </div>
      {currentAnim && (
        <div>
          <h3>{currentAnim.title} <button onClick={onClickRun}>Run</button></h3>
          <div>{currentAnim.description}</div>
          <currentAnim.component id="anim" reRenderToken={reRenderToken} />
        </div>
      )}
    </div>
  );
}
