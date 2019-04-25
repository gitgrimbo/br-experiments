import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import SheetsExplorer from "../sheets/SheetsExplorer";

export default function DataFieldset({
  data,
  dataSources,
}) {
  return (
    <>
      <div>
        <p>This section provides the ability to load data from external sources, such as Google Sheets.</p>
        <p>The loaded data can then be used to set values within the SVG image, see below.</p>
      </div>
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
