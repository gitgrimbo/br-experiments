import * as React from "react";

// All URL-selecting components must have a url property in their state.

export interface ListSourceProps {
  initialState;
  urls: string[];
  onUrlSelected: (string) => void;
  onChangeState: (state) => void;
}

export function ListSource({
  initialState,
  urls,
  onUrlSelected,
  onChangeState,
}: ListSourceProps): React.ReactElement | null {
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

export interface GooglePhotosSourceProps {
  initialState;
  onUrlSelected: (string) => void;
  onChangeState: (state) => void;
}

export function GooglePhotosSource({
  initialState,
  onUrlSelected,
  onChangeState,
}: GooglePhotosSourceProps): React.ReactElement | null {
  return (
    <div>
      Google Photos URL:{" "}
      <button>TODO</button>
    </div>
  );
}

export interface TextBoxSourceProps {
  initialState;
  onUrlSelected: (string) => void;
  onChangeState: (state) => void;
}

export function TextBoxSource({
  initialState,
  onUrlSelected,
  onChangeState,
}: TextBoxSourceProps): React.ReactElement | null {
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

