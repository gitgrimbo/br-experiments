function parseSampleData(svg) {
  const el = svg.querySelector("#sample\\.data");
  if (!el) {
    return null;
  }
  const text = el.textContent;
  let currentCategory = null;
  return text.split(/[\n\r]/)
    .filter((line) => !!line)
    .reduce((data, line, i) => {
      if (line.startsWith("#")) {
        currentCategory = line.substring(1);
        data[currentCategory] = data[currentCategory] || [];
      } else {
        data[currentCategory].push(line);
      }
      return data;
    }, {});
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
    sampleData,
  };
}

function setValue(doc, id, value) {
  const el = doc.getElementById(id);
  const tagName = el.tagName.toLowerCase();
  if (tagName === "image") {
    return el.setAttribute("xlink:href", value);
  }
  return setText(doc, id, value);
}

function setText(doc, id, value) {
  const el = doc.getElementById(id);
  const span = el.querySelector("tspan");
  (span || el).textContent = value;
}

function setVisible(doc, id, value) {
  const el = doc.getElementById(id);
  if (el) {
    el.style.display = value ? "" : "none";
  }
}

export default {
  parseSampleData,
  parseSVG,
  setText,
  setValue,
  setVisible,
};