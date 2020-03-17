export function keyframesFromTo(name, from = "", to = "") {
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

export function animOpacity(name, from = 0, to = 1) {
  return keyframesFromTo(name, `opacity: ${from};`, `opacity: ${to};`);
}
