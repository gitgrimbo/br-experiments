import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import SheetsExplorer from "../sheets/SheetsExplorer";

function LoadDataHelp() {
  return (
    <>
      <p>This section provides the ability to load data from external sources, such as Google Sheets.</p>
      <p>The loaded data can then be used to set values within the SVG image, see below.</p>
    </>
  );
}

export default function DataFieldset({
  data,
  dataSources,
}) {
  return (
    <>
      <ClickableFieldset legend="2: Data" extraLegend="(optional)" help={<LoadDataHelp />}>
        {data && data.map(({ sheets, title }) => (
          <div style={{ marginTop: "1em" }}>
            <ClickableFieldset legend={title}>
              <SheetsExplorer sheets={sheets} />
            </ClickableFieldset>
          </div>
        ))}
        {dataSources && dataSources.map((dataSource, i) => (
          <div style={{ marginTop: "1em" }} key={i}>{dataSource.component()}</div>
        ))}
      </ClickableFieldset>
    </>
  );
}
