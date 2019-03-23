import * as SVG from "./svg";
import Dimensions from "./Dimensions";

// https://stackoverflow.com/a/986977/319878
function getScrollBarWidth(): number {
  const inner = document.createElement("p");
  inner.style.width = "100%";
  inner.style.height = "200px";

  const outer = document.createElement("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);

  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);

  return (w1 - w2);
}

export function scaleSVGWithinIFrame(
  iframe: HTMLIFrameElement,
  svg: SVGElement,
  windowDimensions: Dimensions,
  shouldScale = false,
): void {
  const { width, height } = SVG.getSVGAttributeSize(svg);
  console.log("getSVGAttributeSize", width, height);

  svg.style.width = width;
  svg.style.height = height;

  const svgRect = svg.getBoundingClientRect();

  console.log("svgRect", svgRect);

  // try and make the SVG scale to the width of the window
  const scale = Math.min(1, shouldScale ? windowDimensions.width / svgRect.width : 1);

  svg.style.transform = `scale(${scale})`;
  svg.style.transformOrigin = "0 0";

  if (shouldScale) {
    iframe.scrolling = "no";
  } else {
    iframe.scrolling = "yes";
  }

  console.log("scaleSVG", svg.style.width, svg.style.height, scale, svg.style.transform);
}

export interface DataItem {
  id: string;
  value: string;
  visible: boolean;
}

export interface UpdateIFrameWithSVGSourceResult {
  svgBoundingClientRect: DOMRect;
  dataIds: string[];
  data: DataItem[];
  sampleData: object | null;
}

export function updateIFrameWithSVGSource(
  iframe: HTMLIFrameElement,
  svgSource: string,
  shouldScale = true,
  windowDimensions: Dimensions,
  svgUrlStr: string,
): UpdateIFrameWithSVGSourceResult {
  const doc = iframe.contentDocument;

  doc.firstElementChild.innerHTML = `
<style>
html, body {
  padding: 0;
  margin: 0;
}
</style>
<body>
${svgSource}
</body>
`;

  const svg = doc.querySelector("svg");
  SVG.makeRelativeImageLinksAbsolute(svgUrlStr, svg);
  const { svgBoundingClientRect, dataIds, sampleData } = SVG.parseSVG(svg);
  const ratio = svgBoundingClientRect.width / svgBoundingClientRect.height;

  const iframeWidth = Math.min(windowDimensions.width, svgBoundingClientRect.width);
  iframe.width = String(iframeWidth);
  iframe.height = String(iframeWidth / ratio);

  scaleSVGWithinIFrame(iframe, svg, windowDimensions, shouldScale);

  const data = dataIds.map((id) => {
    const el = svg.getElementById(id);
    const value = SVG.getElementValue(el);
    return {
      id,
      value,
      visible: true,
    };
  });

  return {
    svgBoundingClientRect,
    dataIds,
    data,
    sampleData,
  };
}

export function updateSVG(svg: SVGElement, data: DataItem[]): void {
  data.forEach(({ id, value, visible }, idx) => {
    if (value !== null) {
      SVG.setValue(svg.ownerDocument, id, value);
    }
    SVG.setVisible(svg.ownerDocument, id, visible);
  });
}
