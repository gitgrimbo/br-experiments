import React from "react";

import AsyncButton from "../common/AsyncButton";

// All URL-selecting components must have a url property in their state.

export function ListSource({
  initialState,
  urls,
  onUrlSelected,
  onChangeState,
}) {
  const url = initialState && initialState.url;

  console.log("ListSource", url);

  const setUrl = (url) => {
    const state2 = {
      ...initialState,
      url,
    };
    onChangeState && onChangeState(state2);
    onUrlSelected && onUrlSelected(url);
  };

  React.useEffect(() => {
    if (!url) {
      setUrl(urls[0]);
    }
  }, [url]);

  const onChange = (e) => {
    e.preventDefault();
    const url = e.target.value;
    setUrl(url);
  };

  return (
    <div>
      Local URL:{" "}
      <select value={url || ""} onChange={onChange}>
        {
          urls && (
            urls.map((url, i) => <option key={i} value={url}>{url}</option>)
          )
        }
      </select>
    </div>
  );
}

export function GooglePhotosSource() {
  return (
    <div>
      Google Photos URL:{" "}
      <button>TODO</button>
    </div>
  );
}

export function TextBoxSource({
  initialState,
  onUrlSelected,
  onChangeState,
}) {
  const url = initialState && initialState.url;

  console.log("TextBoxSource", url);

  const onChange = (e) => {
    e.preventDefault();
    const url = e.target.value;
    const state2 = {
      ...initialState,
      url,
    };
    onChangeState && onChangeState(state2);
    onUrlSelected && onUrlSelected(url);
  };

  return (
    <div style={{ display: "flex" }}>
      URL:{"\u00A0"}
      <input type="text" value={url || ""} onChange={onChange} style={{ flex: "1" }} />
    </div>
  );
}

export default function ImageLoader({
  sources,
  state,
  setState,
  onChangeImgSource,
}) {
  const { mode, url } = state || {};

  const setMode = (mode) => setState((state) => ({
    ...state,
    mode,
  }));

  if (!mode) {
    setMode(Object.keys(sources)[0]);
    return "No loader source selected";
  }

  const onClickLoad = async (e) => {
    e.preventDefault();
    // https://fetch.spec.whatwg.org/#dom-requestinit-cache
    const req = new Request(url, {
      cache: "reload",
    });
    console.log(req);
    const resp = await fetch(req);
    const text = await resp.text();
    const i = text.indexOf("<svg");
    if (i >= 0) {
      const imgSource = text.substring(i);
      onChangeImgSource && onChangeImgSource(imgSource);
    }
  };

  const _onChangeMode = (e) => {
    e.preventDefault();
    setMode(e.target.value);
  };

  let component;
  const source = sources[mode];
  if (source) {
    component = source.component();
  }
  console.log(mode, source, component);

  return (
    <>
      <div>
        Image source: <select onChange={_onChangeMode}>{
          Object.entries(sources)
            .map(
              ([key, { title }]) => <option key={key} value={key}>{title()}</option>
            )
        }</select>
      </div>
      <br />
      {component}
      <div style={{ marginTop: "1em" }}>
        <AsyncButton onClick={onClickLoad}>Load</AsyncButton>
      </div>
    </>
  );
}
