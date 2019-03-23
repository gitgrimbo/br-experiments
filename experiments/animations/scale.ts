import { keyframesFromTo } from "./css";

export default function scale(items: Element | Element[], id: string, duration = 0.2, offset = 0, scaleFrom = 0, scaleTo = 1): {
  css: string;
  animElements: {
    el: Element;
    className: string;
  }[];
  offset: number;
} {
  if (!Array.isArray(items)) {
    items = [items];
  }

  let css = "";
  const animElements = [];

  const animationName = `${id}_animation`;
  const fadeInCss = keyframesFromTo(animationName, `
  transform: scale(${scaleFrom});
      `, `
  transform: scale(${scaleTo});
      `);
  css += "\n" + fadeInCss;

  items.forEach((item: Element, i) => {
    const className = `${id}_item_${i}`;

    const elementCss = `
.${className} {
  animation: ${animationName} ${duration}s linear;
  animation-delay: ${offset}s;
  animation-fill-mode: forwards;
  transform: scale(0);
}`;

    css += "\n" + elementCss;

    animElements.push({
      el: item,
      className,
    });
  });

  return {
    css,
    animElements,
    offset,
  };
}
