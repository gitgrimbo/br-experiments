import * as React from "react";

import useSVG from "./useSVG";
import { setStateOnChange } from "./state-utils";
import fadeInAndStroke from "./fade-in-and-stroke";
import fadeIn from "./fade-in";
import { fadeInSwish } from "./swish";

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

  function updateSVG(svg: SVGElement) {
    //console.log("updateSVG", svg);

    const animElements = [];

    const styleElement = styleRef.current;
    styleElement.innerHTML = "";

    const letterDuration = parseFloat(state.letterDuration);

    // for css animations, "forwards" fill-mode uses the CSS from the "to" of the animation.
    // i.e. does not reset the CSS back to before the animation.

    // draw each black letter one-by-one,
    // by animating their stroke and opacity
    const {
      css: fadeInAndStrokeCss,
      animElements: fadeInAndStrokeAnimElements,
      offset,
    } = fadeInAndStroke(Array.from(svg.querySelectorAll("#Bladerunners-text-black path")), `${id}_black_letters`, letterDuration);

    styleElement.innerHTML += "\n" + fadeInAndStrokeCss;
    animElements.push(...fadeInAndStrokeAnimElements);

    // Can't 'stroke draw' the white 'letters' because they are fills and not strokes.
    // So we fade them in.
    const {
      css: fadeInWhiteLettersCss,
      animElements: fadeInWhiteLettersAnimElements,
    } = fadeIn(Array.from(svg.querySelectorAll("#Bladerunners-text-white path")), `${id}_white_letters`, letterDuration);

    styleElement.innerHTML += "\n" + fadeInWhiteLettersCss;
    animElements.push(...fadeInWhiteLettersAnimElements);

    const {
      css: fadeInSwishCss,
      animElements: fadeInSwishAnimElements,
    } = fadeInSwish(svg, `${id}_fade_in_swish`, parseFloat(state.swishFadeDuration), offset);

    styleElement.innerHTML += "\n" + fadeInSwishCss;
    animElements.push(...fadeInSwishAnimElements);

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
