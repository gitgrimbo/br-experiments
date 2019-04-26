import SVG from "./svg";

export function updateIFrameWithSVGSource(iframe, svgSource, scale = 1) {
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
  iframe.width = width * scale;
  iframe.height = height * scale;
  svg.style.width = width * scale;
  svg.style.height = height * scale;

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
