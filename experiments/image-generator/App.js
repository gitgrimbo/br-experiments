import React from "react";

import AsyncButton from "../common/AsyncButton";
import ClickableFieldset from "../common/ClickableFieldset";
import ErrorBox from "../common/ErrorBox";
import Sheets from "../google/sheets";
import SheetsExplorer from "../sheets/SheetsExplorer";
import DataInput from "./DataInput";
import createPNG from "./createPNG";
import SVG from "./svg";
import { moveData, setDataValue } from "./array-reducer";
import { GoogleSignInButton } from "../sheets/GoogleSignInButton";

function updateSVG(svg, data) {
  data.forEach(({ id, value, visible }, idx) => {
    if (value !== null) {
      SVG.setValue(svg, id, value);
    }
    SVG.setVisible(svg, id, visible);
  });
}

const reducer = (state, action) => {
  const set = (name, value) => {
    return {
      ...state,
      [name]: value || action.value,
    };
  };
  switch (action.type) {
    case "setUrl": return set("url");
    case "setSVGSource": return set("svgSource");
    case "setCreatePNGError": return set("createPNGError");
    case "setPNGURL": return set("pngURL");
    case "setData": return set("data");
    case "setSampleData": return set("sampleData");
    case "initialiseData": {
      const data = action.value.ids.map((id) => ({ id, value: "" }));
      return set("data", data);
    }
    case "setDataValue": {
      const { dataIdx, name, value } = action.value;
      return set("data", setDataValue(state.data, dataIdx, name, value));
    }
    case "moveData": {
      const { oldIndex, newIndex } = action.value;
      return set("data", moveData(state.data, oldIndex, newIndex));
    }
    default:
      return state;
  }
};

const initialState = {
  url: "./starting-lineup.svg",
  svgSource: null,
  pngURL: null,
  createPNGError: null,
  data: null,
  sampleData: null,
};

const svgUrls = [
  "./starting-lineup.svg",
  "./box-score.svg"
];

function LoadImage({ url, onChange, onClickLoad }) {
  return (
    <>
      URL:
      {" "}
      <select onChange={onChange}>
        {svgUrls.map((url, i) => <option key={i} value={url}>{url}</option>)}
      </select>
      {" "}
      <input type="text" value={url} onChange={onChange} />
      {" "}
      <AsyncButton onClick={onClickLoad}>Load</AsyncButton>
    </>
  );
}

async function loadSpreadsheet(spreadsheetId) {
  const response = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId,
  });
  return response.result;
};

function App(props) {
  const {
    apiKey,
    clientId,
  } = props;
  const inititialSpreadsheetId = props.spreadsheetId;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [spreadsheet, setSpreadsheet] = React.useState(null);
  const [spreadsheetId, setSpreadsheetId] = React.useState(inititialSpreadsheetId);
  const [gapiError, setGAPIError] = React.useState(null);
  const iframeRef = React.useRef();

  React.useEffect(() => {
    (async () => {
      setGAPIError(null);
      const onSignInChanged = (...args) => console.log(...args);
      try {
        await Sheets.initGoogleSheets({
          apiKey,
          clientId,
          onSignInChanged,
        });
      } catch (err) {
        console.error(err);
        setGAPIError(err);
      }
    })();
  }, []);

  const onClickLoad = async (e) => {
    const resp = await fetch(state.url);
    const text = await resp.text();
    const i = text.indexOf("<svg");
    if (i >= 0) {
      dispatch({ type: "setSVGSource", value: text.substring(i) });
    }
  };

  const onChangeData = (e) => {
    if (e.type === "item") {
      const { idx, name, value } = e;
      return dispatch({ type: "setDataValue", value: { dataIdx: idx, name, value } });
    }
    if (e.type === "move") {
      const { oldIndex, newIndex } = e;
      return dispatch({ type: "moveData", value: { oldIndex, newIndex } });
    }
  };

  const updateIFrameWithSVGSource = (iframe, svgSource) => {
    const doc = iframe.contentDocument;
    console.log(doc.firstElementChild.tagName);
    doc.firstElementChild.innerHTML = `
<style>html, body {
  padding: 0;
  margin: 0;
}</style>
<body>
${svgSource}
</body>
`;
    const svg = doc.querySelector("svg");
    const { width, height, dataIds, sampleData } = SVG.parseSVG(svg);
    iframe.width = width;
    iframe.height = height;

    const data = dataIds.map((id) => {
      const el = svg.getElementById(id);
      const value = SVG.getElementValue(el);
      return {
        id,
        value,
        visible: true,
      };
    });

    dispatch({ type: "setData", value: data });
    dispatch({ type: "setSampleData", value: sampleData });
  }

  React.useEffect(() => {
    if (iframeRef.current && state.svgSource) {
      updateIFrameWithSVGSource(iframeRef.current, state.svgSource);
    }
  }, [state.svgSource]);

  const onClickUpdateImage = async (e) => {
    const svg = iframeRef.current.contentDocument.querySelector("svg");
    updateSVG(svg, state.data);
  };

  const onClickCreatePNG = async (e) => {
    // clear error
    dispatch({ type: "setCreatePNGError", value: null });
    try {
      if (!iframeRef.current) {
        throw new Error("Can't convert image. No source image loaded.");
      }
      const svg = iframeRef.current.contentDocument.querySelector("svg");
      if (!svg) {
        throw new Error("Can't convert image. No source SVG.");
      }
      const svgSource = svg.outerHTML.trim();
      const pngURL = await createPNG(svgSource);
      console.log(pngURL);
      dispatch({ type: "setPNGURL", value: pngURL });
    } catch (err) {
      const { createPNG } = err;
      const msg = "Create PNG failed";
      const value = (err.message ? err.message + ": " + msg : msg) + (createPNG ? "\n" + JSON.stringify(createPNG) : "");
      dispatch({ type: "setCreatePNGError", value });
    }
  };

  const onClickLoadData = async (e) => {
    setSpreadsheet(null);
    if (spreadsheetId) {
      try {
        setSpreadsheet({
          spreadsheet: await loadSpreadsheet(spreadsheetId),
        });
      } catch (err) {
        setSpreadsheet({
          error: err,
        })
      }
    }
  };

  const removeDataPrefixFromId = (id) => id.replace(/^data\./, "");

  return (
    <React.Fragment>
      If you cannot load images/spreadsheets, try <GoogleSignInButton /> to Google.
      <h1>Image Generator</h1>
      {gapiError && JSON.stringify(gapiError)}
      <ClickableFieldset legend="1: Load image">
        <LoadImage
          url={state.url}
          onChange={(e) => dispatch({ type: "setUrl", value: e.target.value })}
          onClickLoad={onClickLoad}
        />
      </ClickableFieldset>
      <ClickableFieldset legend="2: Load data">
        <button onClick={onClickLoadData}>Load</button>
        {" "}
        <input size="42" value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)} />
        {spreadsheet && spreadsheet.spreadsheet && <SheetsExplorer spreadsheetId={spreadsheetId} sheets={spreadsheet.spreadsheet.sheets} />}
      </ClickableFieldset>
      <ClickableFieldset legend="3: Set data">
        {state.data && <DataInput data={state.data} sampleData={state.sampleData} onChange={onChangeData} idFormatter={removeDataPrefixFromId} />}
        <br />
        <div>
          <AsyncButton onClick={onClickUpdateImage}>Update image</AsyncButton>
        </div>
      </ClickableFieldset>
      {
        state.svgSource && (
          <div>
            <br />
            <AsyncButton onClick={onClickCreatePNG}>Create PNG</AsyncButton>
            {state.createPNGError && <div><ErrorBox title="Error creating PNG" error={state.createPNGError} inline={true} /></div>}
          </div>
        )
      }
      {state.svgSource && (
        <div>
          <h2>Source Image</h2>
          <div style={{ width: "100%", overflow: "auto" }}>
            <iframe ref={iframeRef}></iframe>
          </div>
        </div>
      )}
      {state.pngURL && (
        <div>
          <h2>PNG Image</h2>
          <img src={state.pngURL} />
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
