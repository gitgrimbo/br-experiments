export function parseSampleData(svg: SVGElement): object | null {
  const el = svg.querySelector("#sample\\.data");
  if (!el) {
    return null;
  }
  try {
    return JSON.parse(el.textContent);
  } catch (err) {
    return null;
  }
}

export function getSVGAttributeSize(svg: SVGElement): {
  width: string;
  height: string;
} {
  return {
    width: svg.getAttribute("width"),
    height: svg.getAttribute("height"),
  };
}

export interface ParseSVGResult {
  svgBoundingClientRect: DOMRect;
  dataIds: string[];
  sampleData: object | null;
}

export function parseSVG(svg: SVGElement): ParseSVGResult {
  const svgBoundingClientRect = svg.getBoundingClientRect();
  const dataIds = Array.from(svg.querySelectorAll("[id]"))
    .map((el) => el.id)
    .filter((id) => id.match(/^data\./));
  const sampleData = parseSampleData(svg);
  return {
    svgBoundingClientRect,
    dataIds,
    sampleData,
  };
}

export function getElementValue(el: Element) {
  switch (el.tagName.toLowerCase()) {
    case "image": {
      // console.log(el);
      const href = el.getAttribute("xlink:href");
      // console.log(href);
      const isDataUrl = href.startsWith("data:image/");
      // console.log(isDataUrl);
      return isDataUrl ? null : href;
    }
    default: return el.textContent;
  }
}

export function setText(doc: HTMLDocument, id: string, value) {
  const el = doc.getElementById(id);
  const span = el.querySelector("tspan");
  (span || el).textContent = value;
}

export function setValue(doc: HTMLDocument, id: string, value) {
  const el = doc.getElementById(id);
  const tagName = el.tagName.toLowerCase();
  if (tagName === "image") {
    return el.setAttribute("xlink:href", value);
  }
  return setText(doc, id, value);
}

export function setVisible(doc: HTMLDocument, id: string, value) {
  const el = doc.getElementById(id);
  if (el) {
    el.style.display = value ? "" : "none";
  }
}
