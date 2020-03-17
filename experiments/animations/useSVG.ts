import * as React from "react";

export default function useSVG({
  svgUrl,
  svgHolderRef,
}) {
  const [svgAppended, setSVGAppended] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const resp = await fetch(svgUrl);
      const svgSource = await resp.text();
      if (svgHolderRef.current) {
        svgHolderRef.current.innerHTML = svgSource;

        const svg = svgHolderRef.current.querySelector("svg");

        // allow the SVG to expand to width of window.
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        setSVGAppended(true);
      }
    })();
  }, []);

  return svgAppended;
}
