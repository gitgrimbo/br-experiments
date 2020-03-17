import * as React from "react";

import { keyframesFromTo, animOpacity } from "./css";
import useSVG from "./useSVG";

export default function Logo1Animation({
  id,
}) {
  const styleRef = React.useRef<HTMLStyleElement>();
  const svgHolderRef = React.useRef<HTMLDivElement>();
  const svgAppended = useSVG({
    svgUrl: "../img/ty/Bladerunners-original-logo.svg",
    svgHolderRef,
  });

  if (svgAppended) {
    const svg = svgHolderRef.current.querySelector("svg");
    const styleElement = styleRef.current;

    let offset = 0;
    const duration = 0.2;
    const offsets = [];

    const animatedElements = [];

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
          animation: ${animationName} ${duration}s linear;
          animation-delay: ${offset}s;
          animation-fill-mode: forwards;
          opacity: 0;
        }`;
      styleElement.innerText += "\n" + keyframesCss + "\n" + css;
      path.classList.add(className);

      offsets.push(offset);
      animatedElements.push(path);
      offset += duration;
    });

    // draw each white letter (a 'background' letter behind the black ones) one-by-one,
    // by animating their stroke and opacity
    svg.querySelectorAll("#Bladerunners-text-white path").forEach((path: SVGPathElement, i) => {
      const className = `${id}_bladerunners_white_letter_path_${i}`;
      const animationName = `${id}_bladerunners_white_letter_path${i}`;
      const css = `
        .${className} {
          animation: ${animationName} ${duration}s linear;
          animation-delay: ${offset[i]}s;
          animation-fill-mode: forwards;
          opacity: 0;
        }`;

      animatedElements.push(path);

      const keyframesCss = animOpacity(animationName);
      styleElement.innerText += "\n" + keyframesCss + "\n" + css;
      path.classList.add(className);
    });

    styleElement.innerText += animOpacity(`${id}_fadein`, 0, 1);

    const allLettersDoneOffset = offset;
    const swishFadeDuration = 1;
    const sheffieldSwish = svg.querySelector("#SHEFFIELD-text");
    const sheffieldTextWhite = svg.querySelector("#swish-white");
    [sheffieldSwish, sheffieldTextWhite].forEach((el: SVGElement) => {
      el.style.animation = `${id}_fadein ${swishFadeDuration}s linear`;
      el.style.animationDelay = `${allLettersDoneOffset}s`;
      el.style.animationFillMode = "forwards";
      el.style.opacity = String(0);

      animatedElements.push(el);
    });
  }

  return (
    <>
      <style ref={styleRef}></style>
      <div id={id} ref={svgHolderRef}></div>
    </>
  );
}
