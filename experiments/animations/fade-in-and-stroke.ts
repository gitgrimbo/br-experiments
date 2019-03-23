import { keyframesFromTo } from "./css";

export default function fadeInAndStroke(items: SVGPathElement | SVGPathElement[], id: string, duration = 0.2, offset = 0): {
  css: string;
  animElements: {
    el: SVGPathElement;
    className: string;
  }[];
  offset: number;
  offsets: number[];
} {
  if (!Array.isArray(items)) {
    items = [items];
  }

  const offsets = [];
  let css = "";
  const animElements = [];

  items.forEach((item: SVGPathElement, i) => {
    const totalLength = item.getTotalLength();

    const className = `${id}_item_${i}`;
    const animationName = `${id}_animation_${i}`;

    const keyframesCss = keyframesFromTo(animationName, `
stroke-dashoffset: -${totalLength};
opacity: 0;
    `, `
stroke-dashoffset: 0;
opacity: 1;
    `);

    const pathCss = `
.${className} {
  stroke-dasharray: ${totalLength};
  animation: ${animationName} ${duration}s linear;
  animation-delay: ${offset}s;
  animation-fill-mode: forwards;
  opacity: 0;
}`;

    css += "\n" + keyframesCss + "\n" + pathCss;

    animElements.push({
      el: item,
      className,
    });

    offsets.push(offset);
    offset += duration;
  });

  return {
    css,
    animElements,
    offset,
    offsets,
  };
}
