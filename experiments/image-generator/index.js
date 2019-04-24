import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import App from "./App";

Modal.setAppElement("#app");

ReactDOM.render(
  <App
    spreadsheetId="1kBfI8JYsljmmyGr8PEn6cjauPx3yXMT32AFHNLu5M4I"
    clientId="459216665265-rg4ujqcjinpgo3dlgqaori593ufgr8vr.apps.googleusercontent.com"
    apiKey="AIzaSyDsY_aP9gOZD7WWUbpjDnB3aeBSC-zXlhA"
  />,
  document.getElementById("app")
);
