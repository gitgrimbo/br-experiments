import * as React from "react";

import HelpPanel from "../common/HelpPanel";

import ImageLoader from "./ImageLoader";
import {
  TextBoxSource,
  ListSource,
  GooglePhotosSource,
} from "./ImageLoaderSources"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helpHtml = require("./LoadImageTab.help.html");

export interface LoadImageTabProps {
  urls: string[];
  state;
  setState: (callback: (state) => any) => void;
  onChangeSVGSource: (svgSource: string, svgUrl: string) => void;
}

function LoadImageTab({
  urls,
  state,
  setState,
  onChangeSVGSource,
}: LoadImageTabProps): React.ReactElement | null {
  console.log("LoadImageTab", state);

  const onLoadImageUrlSelected = (url) => {
    console.log("onUrlSelected", url);
    setState((state) => ({
      ...state,
      url,
    }));
  };

  const setComponentState = (name) => (newState) => {
    console.log("setComponentState", name, newState)
    setState((state) => ({
      ...state,
      [name]: newState,
    }));
  };

  const imageLoaderSources = {
    urlList: {
      title: () => "Local Url",
      component() {
        return <ListSource
          urls={urls}
          initialState={state && state.urlList}
          onChangeState={setComponentState("urlList")}
          onUrlSelected={onLoadImageUrlSelected}
        />;
      },
    },
    googlePhotos: {
      title: () => "Google Photos",
      component() {
        return <GooglePhotosSource
          initialState={state && state.googlePhotos}
          onChangeState={setComponentState("googlePhotos")}
          onUrlSelected={onLoadImageUrlSelected}
        />;
      },
    },
    anyUrl: {
      title: () => "Any Url",
      component() {
        return <TextBoxSource initialState={state && state.any}
          onChangeState={setComponentState("any")}
          onUrlSelected={onLoadImageUrlSelected}
        />;
      },
    },
  };

  return (
    <>
      <HelpPanel html={helpHtml} />
      <ImageLoader
        sources={imageLoaderSources}
        state={state}
        setState={setState}
        onChangeImgSource={onChangeSVGSource}
      />
    </>
  );
}

export default LoadImageTab;
