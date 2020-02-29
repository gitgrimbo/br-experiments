import * as React from "react";

import AppBar from "@material-ui/core/AppBar";
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import defines from "../common/defines";
import ErrorBox from "../common/ErrorBox";
import HR from "../common/HR";
import { ToolbarWithVersion } from "../common/ToolbarWithText";
import useWindowDimensions from "../common/useWindowDimensions";

import createPNG from "./createPNG";
import { makeSource as makeGoogleSheetsDataSource } from "./GoogleSheetsDataLoader";
import LoadImageTab from "./LoadImageTab";
import LoadDataTab from "./LoadDataTab";
import SetDataTab from "./SetDataTab";
import { updateIFrameWithSVGSource, updateSVG, scaleSVGWithinIFrame } from "./svg-iframe";
import reducer from "./reducer";

const svgUrls = [
  "./svgs/starting-lineup.svg",
  "./svgs/starting-lineup-with-opposition.svg",
  "./svgs/box-score.svg",
  "./svgs/test-fixture.svg",
  "./svgs/final-score.svg",
  "./svgs/upcoming.svg",
  "./svgs/upcoming-I.svg",
  "./svgs/upcoming-II.svg",
  "./svgs/upcoming-III.svg",
  "../img/ty/Bladerunners original badge.svg",
  "../img/ty/Bladerunners original logo.svg",
  "./svgs/font-test.svg",
  "./svgs/tall-test.svg",
  "./svgs/wide-test.svg",
];

const initialState = {
  url: svgUrls[1],
  svgSource: null,
  pngURL: null,
  createPNGError: null,
  data: null,
  dataTimestamp: null,
  sampleData: null,
  embeddedSampleData: null,
  imageLoaderFieldset: {},
  tabIdx: 0,
  shouldScaleSVG: true,
};

export interface AppProps {
  apiKey: string;
  clientId: string;
  spreadsheetId: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const {
    apiKey,
    clientId,
    spreadsheetId,
  } = props;
  const windowDimensions = useWindowDimensions();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const makePropReducer = (prop) => (reducer) => dispatch({ type: "applyReducer", prop, reducer });
  const iframeRef = React.useRef<HTMLIFrameElement>();

  const svgFromIFrame = (iframe) => iframe.contentDocument.querySelector("svg");

  React.useEffect(() => {
    if (iframeRef && iframeRef.current && state.svgSource) {
      scaleSVGWithinIFrame(iframeRef.current, svgFromIFrame(iframeRef.current), windowDimensions, state.shouldScaleSVG);
    }
  }, [state.shouldScaleSVG]);

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
    if (iframeRef && iframeRef.current) {
      updateSVG(svgFromIFrame(iframeRef.current), state.data);
    }
  };

  const onClickCreatePNG = async (e) => {
    // clear error
    dispatch({ type: "setCreatePNGError", value: null });
    try {
      if (!iframeRef.current) {
        throw new Error("Can't convert image. No source image loaded.");
      }
      const svg = svgFromIFrame(iframeRef.current);
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
      const { data, sampleData, width, height } = updateIFrameWithSVGSource(iframeRef.current, svgSource, state.shouldScaleSVG, windowDimensions);
      dispatch({ type: "setSVGSize", value: { width, height } });
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
        <ToolbarWithVersion title="Image Generator" gitShort={defines.GIT_SHORT} gitDate={defines.GIT_DATE} />
      </AppBar>
      <Tabs value={state.tabIdx || 0} onChange={(e, value) => dispatch({ type: "setGeneric", valueName: "tabIdx", value })}>
        <Tab label="Load Image"></Tab>
        <Tab label="Load Data"></Tab>
        <Tab label="Set Image Data"></Tab>
      </Tabs>
      <div style={{ marginTop: "1em", marginBottom: "1em", padding: "0 0.5em 0.5em 0.5em" }}>
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
      <HR />
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
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!state.shouldScaleSVG}
                  onChange={(e) => dispatch({ type: "setShouldScaleSVG", value: !e.target.checked })}
                  value="true"
                  color="primary"
                />
              }
              label="Show SVG normal size"
            />
          </FormGroup>
          <div id="wrap" style={{ width: "100%", overflow: "auto" }}>
            <iframe ref={iframeRef} frameBorder="0"></iframe>
          </div>
        </div>
      )
      }
      {
        state.pngURL && (
          <div>
            <h2>PNG Image</h2>
            <img src={state.pngURL} />
          </div>
        )
      }
    </>
  );
}

export default App;
