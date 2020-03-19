import * as React from "react";

export interface UseSVGProps {
  svgUrl: string;
  svgHolderRef: React.MutableRefObject<HTMLElement>;
  onAppend?: (svg: SVGElement) => void;
}

export default function useSVG({
  svgUrl,
  svgHolderRef,
  onAppend,
}: UseSVGProps): boolean {
  const [svgAppended, setSVGAppended] = React.useState(false);

  async function effect(): Promise<void> {
    const resp = await fetch(svgUrl);
    const svgSource = await resp.text();
    if (svgHolderRef.current) {
      svgHolderRef.current.innerHTML = svgSource;

      const svg = svgHolderRef.current.querySelector("svg");

      // allow the SVG to expand to width of window.
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      onAppend && onAppend(svg);

      setSVGAppended(true);
    }
  }

  React.useEffect(() => {
    effect();
  }, []);

  return svgAppended;
}
