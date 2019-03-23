import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const appElement = document.getElementById("app");
ReactDOM.render(<App onRendered={() => {
  const scheduleElement = appElement.querySelector("[data-bladerunners-schedule]");
  const markupElement = document.getElementById("markup");
  markupElement.value = "";
  appendOuterHTMLOf(scheduleElement, { appendTo: markupElement });
}} />, appElement);
