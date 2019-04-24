import React from "react";

import AsyncButton from "../common/AsyncButton";
import ClickableFieldset from "../common/ClickableFieldset";
import ErrorBox from "../common/ErrorBox";
import { GoogleSignInButton } from "../sheets/GoogleSignInButton";

import createPNG from "./createPNG";
import DataInput from "./DataInput";
import { makeSource as makeGoogleSheetsDataSource } from "./GoogleSheetsDataLoader";
import ImageLoaderFieldset from "./ImageLoaderFieldset";
import {
  arrayMoveValue,
  arraySetValue,
  setValue,
} from "./reducer-utils";
import { updateIFrameWithSVGSource, updateSVG } from "./svg-iframe";
import DataFieldset from "./DataFieldset";

const reducer = (state, action) => {
  const set = setValue(state);
  switch (action.type) {
    case "applyReducer": {
      const { prop, reducer } = action;
      const oldValue = state[prop];
      const newValue = reducer(oldValue);
      if (oldValue === newValue) {
        return state;
      }
      return {
        ...state,
        [prop]: newValue,
      };
    }
    case "setGeneric": return set(action.valueName, action.value);
    case "setSVGSource": return set("svgSource", action.value);
    case "setCreatePNGError": return set("createPNGError", action.value);
    case "setPNGURL": return set("pngURL", action.value);
    case "setData": {
      const state2 = set("data", action.value);
      return {
        ...state2,
        dataTimestamp: Date.now(),
      };
    };
    case "setEmbeddedSampleData": return set("embeddedSampleData", action.value);
    case "initialiseData": {
      const data = action.value.ids.map((id) => ({ id, value: "" }));
      return set("data", data);
    }
    case "setDataValue": {
      const { dataIdx, name, value } = action.value;
      return set("data", arraySetValue(state.data, dataIdx, name, value));
    }
    case "moveData": {
      const { oldIndex, newIndex } = action.value;
      return set("data", arrayMoveValue(state.data, oldIndex, newIndex));
    }
    case "setImageLoaderFieldset": {
      console.log("setImageLoaderFieldset", action.value);
      return set("imageLoaderFieldset", action.value);
    };
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
  dataTimestamp: null,
  sampleData: null,
  embeddedSampleData: null,
  imageLoaderFieldset: {},
};

const svgUrls = [
  "./starting-lineup.svg",
  "./box-score.svg",
  "./test-fixture.svg",
];

function SetDataHelp() {
  return (
    <>
      <p>This section provides the ability to set image data.</p>
      <p>The data can be input manually, or chosen from compatible data loaded above.</p>
    </>
  );
}

function App(props) {
  const {
    apiKey,
    clientId,
    spreadsheetId,
  } = props;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const makePropReducer = (prop) => (reducer) => dispatch({ type: "applyReducer", prop, reducer });

  const [signInError, setSignInError] = React.useState(null);
  const iframeRef = React.useRef();

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

  const removeDataPrefixFromId = (id) => id.replace(/^data\./, "");

  const onChangeSVGSource = (svgSource) => {
    dispatch({ type: "setSVGSource", value: svgSource });
    if (iframeRef.current && svgSource) {
      const { data, sampleData } = updateIFrameWithSVGSource(iframeRef.current, svgSource);
      dispatch({ type: "setData", value: data });
      dispatch({ type: "setEmbeddedSampleData", value: sampleData });
    }
  };

  const dataSources = [
    makeGoogleSheetsDataSource({
      apiKey,
      clientId,
      inititialSpreadsheetId: spreadsheetId,
      onSpreadsheetLoaded(spreadsheet) {
        makePropReducer("sampleData")((state) => {
          const state2 = state || [];
          return state2.concat(spreadsheet);
        });
      },
    }),
  ];

  let dataForDataFieldset = [];
  if (state.embeddedSampleData) {
    const spreadsheet = {
      title: "Embedded Sample Data",
      sheets: Object.keys(state.embeddedSampleData).map((key) => {
        const values = state.embeddedSampleData[key];
        return {
          properties: {
            title: key,
          },
          values: values.map((value) => [value]),
        };
      }),
    };
    dataForDataFieldset.push(spreadsheet);
  }
  if (state.sampleData) {
    dataForDataFieldset = dataForDataFieldset.concat(state.sampleData);
  }

  return (
    <React.Fragment>
      If you cannot load images/spreadsheets, try <GoogleSignInButton /> to Google.
      <h1>Image Generator</h1>
      <ImageLoaderFieldset
        urls={svgUrls}
        state={state.imageLoaderFieldset}
        setState={makePropReducer("imageLoaderFieldset")}
        onChangeSVGSource={onChangeSVGSource}
      />
      <br />
      <DataFieldset
        dataSources={dataSources}
        data={dataForDataFieldset}
        setState={makePropReducer("sampleData")}
      />
      <br />
      <ClickableFieldset legend="3: Set data" help={<SetDataHelp />}>
        {
          state.data && (
            <DataInput
              key={state.dataTimestamp}
              data={state.data}
              sampleData={state.embeddedSampleData}
              onChange={onChangeData}
              idFormatter={removeDataPrefixFromId}
            />
          )
        }
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
