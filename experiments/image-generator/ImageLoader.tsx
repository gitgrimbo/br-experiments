import * as React from "react";

import AsyncButton from "../common/AsyncButton";

export interface ImageLoaderSource {
  title: () => string;
  component: () => React.ReactElement | null;
}

export interface ImageLoaderProps {
  sources: {
    [key: string]: ImageLoaderSource;
  };
  state;
  setState: (callback: (state) => any) => void;
  onChangeImgSource: (svgSource: string, svgUrl: string) => void;
}

export default function ImageLoader({
  sources,
  state,
  setState,
  onChangeImgSource,
}: ImageLoaderProps): React.ReactElement | null {
  const { mode, url } = state || {};

  const setMode = (mode) => setState((state) => ({
    ...state,
    mode,
  }));

  React.useEffect(() => {
    if (state && !state.mode) {
      setMode(Object.keys(sources)[0]);
    }
  }, []);

  if (!mode) {
    return <div>{"No loader source selected"}</div>;
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
      onChangeImgSource && onChangeImgSource(imgSource, resp.url);
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
