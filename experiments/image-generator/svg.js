function parseSampleData(svg) {
  const el = svg.querySelector("#sample\\.data");
  if (!el) {
    return null;
  }
  const text = el.textContent;
  // TODO
}

function parseSVG(svg) {
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  const dataIds = Array.from(svg.querySelectorAll("[id]"))
    .map((el) => el.id)
    .filter((id) => id.match(/^data\./));
  const sampleData = parseSampleData(svg);
  return {
    width,
    height,
    dataIds,
  };
}

const setText = (doc, id, value) => {
  const el = doc.getElementById(id);
  const span = el.querySelector("tspan");
  (span || el).textContent = value;
};

export default {
  parseSampleData,
  parseSVG,
  setText,
};
