import { keyframesFromTo } from "./css";

export default function fadeIn(items: Element | Element[], id: string, duration = 0.2, offset = 0, incrementOffset = true): {
  css: string;
  animElements: {
    el: Element;
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

  const animationName = `${id}_animation`;
  const fadeInCss = keyframesFromTo(animationName, `
  opacity: 0;
      `, `
  opacity: 1;
      `);
  css += "\n" + fadeInCss;

  items.forEach((item: Element, i) => {
    const className = `${id}_item_${i}`;

    const elementCss = `
.${className} {
  animation: ${animationName} ${duration}s linear;
  animation-delay: ${offset}s;
  animation-fill-mode: forwards;
  opacity: 0;
}`;

    css += "\n" + elementCss;

    animElements.push({
      el: item,
      className,
    });

    offsets.push(offset);
    if (incrementOffset) {
      offset += duration;
    }
  });

  return {
    css,
    animElements,
    offset,
    offsets,
  };
}
