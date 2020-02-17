import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import HelpPanel from "../common/HelpPanel";
import SheetsExplorer from "../sheets/SheetsExplorer";
import helpHtml from "./LoadDataTab.help.html";

export default function DataFieldset({
  data,
  dataSources,
}) {
  return (
    <>
      <HelpPanel html={helpHtml} />
      {data && data.map(({ sheets, title }, i) => (
        <div key={`data-${i}`} style={{ marginTop: "1em" }}>
          <ClickableFieldset legend={title}>
            <SheetsExplorer
              sheets={sheets}
            />
          </ClickableFieldset>
        </div>
      ))}
      {dataSources && dataSources.map((dataSource, i) => (
        <div key={`data-source-${i}`} style={{ marginTop: "1em" }}>{dataSource.component()}</div>
      ))}
    </>
  );
}
