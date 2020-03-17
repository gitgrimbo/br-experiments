import * as React from "react";
import useSVG from "./useSVG";
import { animOpacity, keyframesFromTo } from "./css";

export default function Badge1Animation({
  id,
}) {
  const styleRef = React.useRef<HTMLStyleElement>();
  const svgHolderRef = React.useRef<HTMLDivElement>();
  const svgAppended = useSVG({
    svgUrl: "../img/ty/Bladerunners-original-badge.svg",
    svgHolderRef,
  });

  if (svgAppended) {
    const svg = svgHolderRef.current.querySelector("svg");
    const styleElement = styleRef.current;

    // for css animations, "forwards" fill-mode uses the CSS from the "to" of the animation.
    // i.e. does not reset the CSS back to before the animation.

    styleElement.innerText += animOpacity(`${id}_fadein`, 0, 1);

    const fadeDuration = 1;
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
      styleElement.innerText += "\n" + css;
      el.classList.add(className);
    });

    const scaleDuration = 0.5;
    const bLogo = svg.querySelector("#b-logo-inner") as SVGElement;
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
      styleElement.innerText += "\n" + keyframesCss + "\n" + css;
      el.classList.add(className);
    })(bLogo);
  }

  return (
    <>
      <style ref={styleRef}></style>
      <div id={id} ref={svgHolderRef}></div>
    </>
  );
}
