import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const container = document.querySelector(".banner-container");
ReactDOM.render(<App cssElement={document.getElementById("banner-styles")} />, container);
