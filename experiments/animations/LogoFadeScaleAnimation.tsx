import * as React from "react";

import useSVG from "./useSVG";
import { setStateOnChange } from "./state-utils";
import fadeIn from "./fade-in";
import scale from "./scale";
import { insertGroups } from "./css";

function useSVGAnim(reRenderToken, svgUpdaterFunction) {
  const styleRef = React.useRef<HTMLStyleElement>();
  const svgHolderRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    console.log("effect", reRenderToken);
    const svg = svgHolderRef.current.querySelector("svg");
    svgUpdaterFunction({
      svg,
      styleElement: styleRef.current,
    });
  }, [reRenderToken]);

  return {
    svgHolderRef,
    styleRef,
  };
}

export default function LogoFadeScaleAnimation({
  id,
  reRenderToken,
}): React.ReactElement | null {
  const [state, setState] = React.useState({
    fadeDuration: "1",
    scaleDuration: "1",
    scaleFrom: "0.0",
    scaleTo: "1.0",
  });
  console.log("render", reRenderToken);

  function updateSVG({
    svg,
    styleElement,
  }: {
    svg: SVGElement;
    styleElement: HTMLStyleElement;
  }) {
    if (!svg) {
      return;
    }

    const gScale = svg.querySelector("g");
    const gFade = gScale.querySelector("g");

    const animElements = [];

    styleElement.innerHTML = "";

    const fadeDuration = parseFloat(state.fadeDuration);
    const scaleDuration = parseFloat(state.scaleDuration);
    const scaleFrom = parseFloat(state.scaleFrom);
    const scaleTo = parseFloat(state.scaleTo);

    // for css animations, "forwards" fill-mode uses the CSS from the "to" of the animation.
    // i.e. does not reset the CSS back to before the animation.

    // Fade in whole logo.
    const {
      css: fadeInCss,
      animElements: fadeInAnimElements,
    } = fadeIn(gFade, `${id}_svg_fadeIn`, fadeDuration);

    styleElement.innerHTML += "\n" + fadeInCss;
    animElements.push(...fadeInAnimElements);

    // Scale whole logo.
    gScale.style.transformOrigin = "50% 50%";
    const {
      css: scaleCss,
      animElements: scaleAnimElements,
    } = scale(gScale, `${id}_svg_scale`, scaleDuration, 0, scaleFrom, scaleTo);

    styleElement.innerHTML += "\n" + scaleCss;
    animElements.push(...scaleAnimElements);

    requestAnimationFrame(() => {
      animElements.forEach(({ el, className }) => el.classList.remove(className))
      requestAnimationFrame(() => animElements.forEach(({ el, className }) => el.classList.add(className)));
    });
  }

  const {
    svgHolderRef,
    styleRef,
  } = useSVGAnim(reRenderToken, updateSVG);

  const svgAppended = useSVG({
    svgUrl: "../img/ty/Bladerunners-original-logo.svg",
    svgHolderRef,
    onAppend(svg) {
      // Cannot add multiple CSS classes with animation property to a single element.
      // The last animation property coming from one of the CSS classes will 'win'.
      // So create new groups so we can apply a single CSS class to each.
      insertGroups(svg, 2);
    },
  });

  return (
    <>
      <div>
        <label>Fade duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "fadeDuration")} data-type="number" size={3} value={state.fadeDuration} />
        </label>
      </div>
      <div>
        <label>Scale duration (s):&nbsp;
          <input onChange={setStateOnChange(state, setState, "scaleDuration")} data-type="number" size={3} value={state.scaleDuration} />
        </label>
        {" "}
        <label>Scale from:&nbsp;
          <input onChange={setStateOnChange(state, setState, "scaleFrom")} data-type="number" size={3} value={state.scaleFrom} />
        </label>
        {" "}
        <label>Scale to:&nbsp;
          <input onChange={setStateOnChange(state, setState, "scaleTo")} data-type="number" size={3} value={state.scaleTo} />
        </label>
      </div>
      <style ref={styleRef}></style>
      <div id={id} ref={svgHolderRef} style={{ marginTop: "10px" }}></div>
    </>
  );
}
