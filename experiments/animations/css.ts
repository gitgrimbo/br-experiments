export function keyframesFromTo(name: string, from = "", to = "") {
  return `
@keyframes ${name} {
  from {
    ${from}
  }
  to {
    ${to}
  }
}
`;
}

export function animOpacity(name: string, from = 0, to = 1) {
  return keyframesFromTo(name, `opacity: ${from};`, `opacity: ${to};`);
}

/**
 * Wraps `<g>` elements around SVG contents.
 * @export
 * @param {SVGElement} svg
 * @param {number} [numberOfGroups=1]
 * @returns
 */
export function insertGroups(svg: SVGElement, numberOfGroups = 1) {
  const last = (arr) => arr[arr.length - 1];
  const rootGroup = svg.querySelector<SVGGElement>("g");
  rootGroup.remove();
  const groups: SVGGElement[] = [];
  while (numberOfGroups-- > 0) {
    const g = svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
    if (groups.length > 0) {
      last(groups).append(g);
    }
    groups.push(g);
  }
  last(groups).append(rootGroup);
  svg.append(groups[0]);
  return {
    rootGroup,
    groups,
  };
}
