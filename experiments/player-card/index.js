import domInit from "./dom";
import svgInit from "./svg";
import svg2Init from "./svg2";

function getApp(type) {
  const apps = {
    dom: domInit,
    svg: svgInit,
    svg2: svg2Init,
  };
  return apps[String(type).toLowerCase()];
}

const container = document.querySelector(".player-card-container");
const type = container.getAttribute("data-player-card-type")
const init = getApp(type);
init(container);
