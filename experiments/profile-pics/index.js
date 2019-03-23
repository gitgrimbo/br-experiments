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

const googleSheetConfig = {
  spreadsheetId: "1kjQZXy-m_ioxhJxHWC5PdeqeIBLsavHWVbq38Fz9ou4",
  clientId: "459216665265-rg4ujqcjinpgo3dlgqaori593ufgr8vr.apps.googleusercontent.com",
  apiKey: "AIzaSyDsY_aP9gOZD7WWUbpjDnB3aeBSC-zXlhA",
};

ReactDOM.render(
  <Component googleSheetConfig={googleSheetConfig} />,
  appEl,
);
