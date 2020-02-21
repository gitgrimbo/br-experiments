import SVG from "./svg";

interface IWindowDimensions {
  width: number;
  height: number;
}

export function scaleSVG(
  iframe: HTMLIFrameElement,
  windowDimensions: IWindowDimensions,
  reset = false,
) {
  const doc = iframe.contentDocument;
  const svg = doc.querySelector("svg");
  const { width } = SVG.parseSVG(svg);
  // try and make the SVG scale to the width of the window
  const scale = Math.min(1, reset ? 1 : windowDimensions.width / width);
  svg.style.transform = `scale(${scale})`;
  svg.style.transformOrigin = "0 0";
}

export function updateIFrameWithSVGSource(
  iframe: HTMLIFrameElement,
  svgSource: string,
  shouldScale = true,
  windowDimensions: IWindowDimensions,
) {
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
  const { width, height, dataIds, sampleData } = SVG.parseSVG(svg);
  const ratio = width / height;
  iframe.width = String(windowDimensions.width);
  iframe.height = String(windowDimensions.width * ratio);
  svg.style.width = width;
  svg.style.height = height;

  if (shouldScale) {
    scaleSVG(iframe, windowDimensions);
  }

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
    width,
    height,
    dataIds,
    data,
    sampleData,
  };
}

export function updateSVG(svg: SVGElement, data: any[]) {
  data.forEach(({ id, value, visible }, idx) => {
    if (value !== null) {
      SVG.setValue(svg, id, value);
    }
    SVG.setVisible(svg, id, visible);
  });
}
