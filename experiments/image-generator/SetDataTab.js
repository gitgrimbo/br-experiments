import React from "react";

import AsyncButton from "../common/AsyncButton";

import DataInput from "./DataInput";

export default function SetDataTab({
  state,
  sampleData,
  onChangeData,
  onClickUpdateImage,
}) {
  const EYE = "👁️";
  const idFormatter = (id) => id.replace(/^data\./, "");
  const headingFormatter = (name) => (name === "visible") ? EYE : name;

  return (
    <>
      <div>
        <p>This section provides the ability to set image data.</p>
        <p>The data can be input manually, or chosen from compatible data loaded above.</p>
      </div>
      {
        state.data && (
          <DataInput
            key={state.dataTimestamp}
            data={state.data}
            sampleData={sampleData}
            onChange={onChangeData}
            idFormatter={idFormatter}
            headingFormatter={headingFormatter}
            propFilter={(propName, propIdx) => propName !== "visible"}
          />
        )
      }
      <br />
      <div>
        <AsyncButton onClick={onClickUpdateImage}>Update image</AsyncButton>
      </div>
    </>
  );
}
