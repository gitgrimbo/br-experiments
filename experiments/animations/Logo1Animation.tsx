import * as React from "react";

import { keyframesFromTo, animOpacity } from "./css";
import useSVG from "./useSVG";
import { setStateOnChange } from "./state-utils";

export default function Logo1Animation({
  id,
  reRenderToken,
}) {
  const [state, setState] = React.useState({
    letterDuration: "0.2",
    swishFadeDuration: "1",
  });
  console.log("render", reRenderToken);
  const styleRef = React.useRef<HTMLStyleElement>();
  const svgHolderRef = React.useRef<HTMLDivElement>();
  const svgAppended = useSVG({
    svgUrl: "../img/ty/Bladerunners-original-logo.svg",
    svgHolderRef,
  });

  function updateSVG(svg) {
    //console.log("updateSVG", svg);

    const animElements = [];

    const styleElement = styleRef.current;
    styleElement.innerHTML = "";

    let offset = 0;
    const offsets = [];
    const letterDuration = parseFloat(state.letterDuration);

    // for css animations, "forwards" fill-mode uses the CSS from the "to" of the animation.
    // i.e. does not reset the CSS back to before the animation.

    // draw each black letter one-by-one,
    // by animating their stroke and opacity
    svg.querySelectorAll("#Bladerunners-text-black path").forEach((path: SVGPathElement, i) => {
      const totalLength = path.getTotalLength();
      const className = `${id}_bladerunners_black_letter_path_${i}`;
      const animationName = `${id}_bladerunners_black_letter_path_${i}`;
      const keyframesCss = keyframesFromTo(animationName, `
        stroke-dashoffset: -${totalLength};
        opacity: 0;
      `, `
        stroke-dashoffset: 0;
        opacity: 1;
      `);
      const css = `
        .${className} {
          stroke-dasharray: ${totalLength};
          animation: ${animationName} ${letterDuration}s linear;
          animation-delay: ${offset}s;
          animation-fill-mode: forwards;
          opacity: 0;
        }`;
      styleElement.innerHTML += "\n" + keyframesCss + "\n" + css;

      animElements.push({
        el: path,
        className,
      });

      offsets.push(offset);
      offset += letterDuration;
    });

    // draw each white letter (a 'background' letter behind the black ones) one-by-one,
    // by animating their stroke and opacity
    svg.querySelectorAll("#Bladerunners-text-white path").forEach((path: SVGPathElement, i) => {
      const className = `${id}_bladerunners_white_letter_path_${i}`;
      const animationName = `${id}_bladerunners_white_letter_path${i}`;
      const css = `
        .${className} {
          animation: ${animationName} ${letterDuration}s linear;
          animation-delay: ${offsets[i]}s;
          animation-fill-mode: forwards;
          opacity: 0;
        }`;

      const keyframesCss = animOpacity(animationName);
      styleElement.innerHTML += "\n" + keyframesCss + "\n" + css;

      animElements.push({
        el: path,
        className,
      });
    });

    styleElement.innerHTML += "\n" + animOpacity(`${id}_fadein`, 0, 1);

    const swishFadeDuration = parseFloat(state.swishFadeDuration);
    const allLettersDoneOffset = offset;
    const sheffieldSwish = svg.querySelector("#SHEFFIELD-text");
    const sheffieldTextWhite = svg.querySelector("#swish-white");
    const swishClassName = `${id}_swish`;
    [sheffieldSwish, sheffieldTextWhite].forEach((el: SVGElement) => {
      animElements.push({
        el,
        className: swishClassName,
      });
    });
    const swishCss = `
      .${swishClassName} {
        animation: ${id}_fadein ${swishFadeDuration}s linear;
        animation-delay: ${allLettersDoneOffset}s;
        animation-fill-mode: forwards;
        opacity: 0;
      }`;
    styleElement.innerHTML += "\n" + swishCss;

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
        <label>Letter anim duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "letterDuration")} data-type="number" size={3} value={state.letterDuration} />
        </label>
      </div>
      <div>
        <label>Swish fade anim duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "swishFadeDuration")} data-type="number" size={3} value={state.swishFadeDuration} />
        </label>
      </div>
      <style ref={styleRef}></style>
      <div id={id} ref={svgHolderRef} style={{ marginTop: "10px" }}></div>
    </>
  );
}
