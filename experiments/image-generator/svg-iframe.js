import SVG from "./svg";

export function updateIFrameWithSVGSource(iframe, svgSource) {
  const doc = iframe.contentDocument;

  doc.firstElementChild.innerHTML = `
<style>html, body {
  padding: 0;
  margin: 0;
}</style>
<body>
${svgSource}
</body>
`;

  const svg = doc.querySelector("svg");
  const { width, height, dataIds, sampleData } = SVG.parseSVG(svg);
  iframe.width = width;
  iframe.height = height;

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

export function updateSVG(svg, data) {
  data.forEach(({ id, value, visible }, idx) => {
    if (value !== null) {
      SVG.setValue(svg, id, value);
    }
    SVG.setVisible(svg, id, visible);
  });
}
