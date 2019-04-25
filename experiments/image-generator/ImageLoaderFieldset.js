import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";

import ImageLoader, {
  TextBoxSource,
  ListSource,
  GooglePhotosSource,
} from "./ImageLoader"

function LoadImageHelp() {
  return (
    <>
      <p>This section provides the ability to load an SVG image from a pre-defined source (this website), from any public URL, or from Google Photos.</p>
    </>
  );
}

export default function ImageLoaderFieldset({
  urls,
  state,
  setState,
  onChangeSVGSource,
}) {
  console.log("ImageLoaderFieldset", state);

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

  console.log("ImageLoaderFieldset", state.mode);

  return (
    <ClickableFieldset legend="1: Load image" help={<LoadImageHelp />}>
      <ImageLoader
        sources={imageLoaderSources}
        state={state}
        setState={setState}
        onChangeImgSource={onChangeSVGSource}
      />
    </ClickableFieldset>
  );
}
