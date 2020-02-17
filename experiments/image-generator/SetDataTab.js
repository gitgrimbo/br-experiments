import React from "react";

import AsyncButton from "../common/AsyncButton";
import HelpPanel from "../common/HelpPanel";

import DataInput from "./DataInput";
import helpHtml from "./SetDataTab.help.html";

export default function SetDataTab({
  state,
  sampleData,
  onChangeData,
  onClickUpdateImage,
}) {
  const EYE = "👁️";

  return (
    <>
      <HelpPanel html={helpHtml} />
      {
        state.data && (
          <DataInput
            key={state.dataTimestamp}
            data={state.data}
            sampleData={sampleData}
            onChange={onChangeData}
            simpleValueSupplier={(item) => item.value}
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
