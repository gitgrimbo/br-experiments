import React from "react";

import AsyncButton from "../common/AsyncButton";

export default function ImageLoader({
  initialUrl,
  urls,
  onChangeImgSource,
}) {
  const [url, setUrl] = React.useState(initialUrl);
  const [imgSource, setImgSource] = React.useState(null);

  const onClickLoad = async (e) => {
    const resp = await fetch(url);
    const text = await resp.text();
    const i = text.indexOf("<svg");
    if (i >= 0) {
      const imgSource = text.substring(i);
      setImgSource(imgSource);
      onChangeImgSource && onChangeImgSource(imgSource);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setUrl(e.target.value);
    onChangeImgSource && onChangeImgSource();
  };

  return (
    <>
      <div>
        Any URL:{" "}
        <input type="text" value={url} onChange={onChange} />
      </div>
      <div>
        Local URL:{" "}
        <select onChange={onChange}>
          {urls.map((url, i) => <option key={i} value={url}>{url}</option>)}
        </select>
      </div>
      <div>
        Google Photos URL:{" "}
        <button>TODO</button>
      </div>
      <AsyncButton onClick={onClickLoad}>Load</AsyncButton>
    </>
  );
}
