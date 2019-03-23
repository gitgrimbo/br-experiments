import * as React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import HelpPanel from "../common/HelpPanel";
import SheetsExplorer from "../sheets/SheetsExplorer";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const helpHtml = require("./LoadDataTab.help.html");

// TODO better types
export interface LoadDataTabProps {
  data: object[];
  dataSources: object[];
}

const LoadDataTab: React.FC<LoadDataTabProps> = ({
  data,
  dataSources,
}: LoadDataTabProps) => {
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

export default LoadDataTab;
