import React from "react";

import AsyncButton from "../common/AsyncButton";
import ClickableFieldset from "../common/ClickableFieldset";
import ErrorBox from "../common/ErrorBox";
import DataInput from "./DataInput";
import createPNG from "./createPNG";
import SVG from "./svg";
import { moveData, setDataValue } from "./array-reducer";

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

function App({ }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const iframeRef = React.useRef();

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
    doc.firstElementChild.innerHTML = `<style>html, body { padding: 0; margin: 0; }</style>\n` + svgSource;
    const svg = doc.querySelector("svg");
    const { width, height, dataIds, sampleData } = SVG.parseSVG(svg);
    iframe.width = width;
    iframe.height = height;

    const svgElementValue = (el) => {
      switch (el.tagName.toLowerCase()) {
        case "image": {
          const href = el.getAttribute("xlink:href");
          const isDataUrl = href.startsWith("data:image/");
          return isDataUrl ? null : href;
        }
        default: return el.textContent;
      }
    };

    const data = dataIds.map((id) => {
      const el = svg.getElementById(id);
      const value = svgElementValue(el);
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

  return (
    <React.Fragment>
      <h1>Image Generator</h1>
      <ClickableFieldset legend="1: Load image">
        URL: <input type="text" value={state.url} onChange={(e) => dispatch({ type: "setUrl", value: e.target.value })} /> <AsyncButton onClick={onClickLoad}>Load</AsyncButton>
      </ClickableFieldset>
      <ClickableFieldset legend="2: Set data">
        {state.data && <DataInput data={state.data} sampleData={state.sampleData} onChange={onChangeData} />}
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
          <iframe ref={iframeRef}></iframe>
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
