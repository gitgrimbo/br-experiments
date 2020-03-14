import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import SVGDiamondApp from "./SVGDiamondApp";

const appEl = document.getElementById("app");
const type = appEl.dataset["type"];
const components = {
  "App": App,
  "SVGDiamond": SVGDiamondApp,
};
const Component = components[type];

ReactDOM.render(
  <Component />,
  appEl,
);
