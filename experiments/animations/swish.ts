import fadeIn from "./fade-in";

export function fadeInSwish(svg, id, swishFadeDuration, offset): {
  css: string;
  animElements: {
    el: SVGElement;
    className: string;
  }[];
} {
  const sheffieldSwish = svg.querySelector("#SHEFFIELD-text");
  const sheffieldTextWhite = svg.querySelector("#swish-white");
  const incrementOffset = false;
  return fadeIn([sheffieldSwish, sheffieldTextWhite], id, swishFadeDuration, offset, incrementOffset);
}
