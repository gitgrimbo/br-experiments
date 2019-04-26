import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";

import AsyncButton from "../common/AsyncButton";
import ErrorBox from "../common/ErrorBox";

import createPNG from "./createPNG";
import { makeSource as makeGoogleSheetsDataSource } from "./GoogleSheetsDataLoader";
import LoadImageTab from "./LoadImageTab";
import LoadDataTab from "./LoadDataTab";
import SetDataTab from "./SetDataTab";
import {
  arrayMoveValue,
  arraySetValue,
  setValue,
} from "./reducer-utils";
import { updateIFrameWithSVGSource, updateSVG } from "./svg-iframe";
import { Typography } from "@material-ui/core";

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
  tabIdx: 0,
};

const svgUrls = [
  "./starting-lineup.svg",
  "./box-score.svg",
  "./test-fixture.svg",
];


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
    console.log("onChangeData", e);
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

  const onChangeSVGSource = (svgSource) => {
    dispatch({ type: "setSVGSource", value: svgSource });
    if (iframeRef.current && svgSource) {
      const scale = 1;
      const { data, sampleData } = updateIFrameWithSVGSource(iframeRef.current, svgSource, scale);
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

  let combinedSampleData = [];
  if (state.embeddedSampleData) {
    const spreadsheet = {
      title: "Image Embedded Data",
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
    combinedSampleData.push(spreadsheet);
  }
  if (state.sampleData) {
    combinedSampleData = combinedSampleData.concat(state.sampleData);
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">Image Generator</Typography>
        </Toolbar>
      </AppBar>
      <Tabs value={state.tabIdx || 0} onChange={(e, value) => dispatch({ type: "setGeneric", valueName: "tabIdx", value })}>
        <Tab label="Load Image"></Tab>
        <Tab label="Load Data"></Tab>
        <Tab label="Set Image Data"></Tab>
      </Tabs>
      <div style={{ marginTop: "1em", marginBottom: "1em", padding: "0 0.5em 0.5em 0.5em", borderBottom: "solid 2px lightgrey" }}>
        {(state.tabIdx === 0) && (
          <LoadImageTab
            urls={svgUrls}
            state={state.imageLoaderFieldset}
            setState={makePropReducer("imageLoaderFieldset")}
            onChangeSVGSource={onChangeSVGSource}
          />
        )
        }
        {(state.tabIdx === 1) && (
          <LoadDataTab
            dataSources={dataSources}
            data={combinedSampleData}
            setState={makePropReducer("sampleData")}
          />
        )
        }
        {(state.tabIdx === 2) && (
          <SetDataTab
            state={state}
            sampleData={combinedSampleData}
            onChangeData={onChangeData}
            onClickUpdateImage={onClickUpdateImage}
          />
        )}
      </div>
      {
        state.svgSource && (
          <div style={{ textAlign: "center" }}>
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
    </>
  );
}

export default App;
