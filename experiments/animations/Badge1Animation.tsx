import * as React from "react";
import useSVG from "./useSVG";
import { animOpacity, keyframesFromTo } from "./css";
import { setStateOnChange } from "./state-utils";

export default function Badge1Animation({
  id,
  reRenderToken,
}) {
  const [state, setState] = React.useState({
    fadeDuration: "1",
    scaleDuration: "1",
  });
  console.log("render", reRenderToken);
  const styleRef = React.useRef<HTMLStyleElement>();
  const svgHolderRef = React.useRef<HTMLDivElement>();
  const svgAppended = useSVG({
    svgUrl: "../img/ty/Bladerunners-original-badge.svg",
    svgHolderRef,
  });

  function updateSVG(svg: SVGElement) {
    //console.log("updateSVG", svg);

    const animElements = [];

    const styleElement = styleRef.current;

    // for css animations, "forwards" fill-mode uses the CSS from the "to" of the animation.
    // i.e. does not reset the CSS back to before the animation.

    styleElement.innerHTML += animOpacity(`${id}_fadein`, 0, 1);

    const fadeDuration = parseFloat(state.fadeDuration);
    const topArcText = svg.querySelector("#top-arc-text");
    const bottomArcText = svg.querySelector("#bottom-arc-text");
    [topArcText, bottomArcText].forEach((el: SVGElement, i) => {
      const className = `${id}_arc_${i}`;
      const css = `
        .${className} {
          animation: ${id}_fadein ${fadeDuration}s linear;
          animation-fill-mode: forwards;
          opacity: 0;
        }`;
      styleElement.innerHTML += "\n" + css;

      animElements.push({
        el,
        className,
      });
    });

    const scaleDuration = parseFloat(state.scaleDuration);
    const bLogo = svg.querySelector("#b-logo-inner");
    ((el) => {
      const className = `${id}_bLogo`;
      const animationName = `${id}_bLogo`;
      const keyframesCss = keyframesFromTo(animationName, `
        opacity: 0;
        transform: scale(0);
      `, `
        opacity: 1;
        transform: scale(1);
      `);
      const css = `
      .${className} {
        animation: ${animationName} ${scaleDuration}s linear;
        animation-fill-mode: forwards;
        opacity: 0;
        transform-origin: 50% 125%;
      }`;
      styleElement.innerHTML += "\n" + keyframesCss + "\n" + css;

      animElements.push({
        el,
        className,
      });
    })(bLogo);

    requestAnimationFrame(() => {
      animElements.forEach(({ el, className }) => el.classList.remove(className))
      requestAnimationFrame(() => animElements.forEach(({ el, className }) => el.classList.add(className)));
    });
  }

  React.useEffect(() => {
    console.log("effect", reRenderToken);
    if (svgAppended) {
      const svg = svgHolderRef.current.querySelector("svg");
      updateSVG(svg);
    }
  }, [reRenderToken]);

  return (
    <>
      <div>
        <label>Fade anim duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "fadeDuration")} data-type="number" size={3} value={state.fadeDuration} />
        </label>
      </div>
      <div>
        <label>Scale anim duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "scaleDuration")} data-type="number" size={3} value={state.scaleDuration} />
        </label>
      </div>
      <style ref={styleRef}></style>
      <div id={id} ref={svgHolderRef} style={{ marginTop: "10px" }}></div>
    </>
  );
}
