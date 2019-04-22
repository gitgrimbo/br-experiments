import React from "react";

import uuid from "../common/uuid";

function Table({ values }) {
  const className = `cls-${uuid()}`;
  return values && (
    <>
      <style>{`
table.${className} {
  padding: 0;
  margin: 0;
  border-collapse: collapse;
  empty-cells: show;
}
table.${className} tr, table.${className} td {
  border: 1px solid lightgrey;
}
      `}</style>
      <table className={className} cellSpacing="0" cellPadding="0">
        <tbody>
          {
            values.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {
                  row.map((cell, cellIdx) => <td key={cellIdx}>{cell}</td>)
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default function SheetsExplorer({
  spreadsheetId,
  sheets,
}) {
  console.log("SheetsExplorer", spreadsheetId, sheets);
  const [values, setValues] = React.useState(null);
  const onClickSheetTitle = async (e) => {
    e.preventDefault();
    const title = e.target.getAttribute("data-title");
    // A1:Z100 used just to try and get all values
    const range = `${title}!A1:Z500`;
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    console.log(response);
    setValues(response.result.values);
  };
  return (
    <>
      <div>{
        sheets.map((sheet, i) => (
          <React.Fragment key={i}>
            {i > 0 ? " / " : null}
            <a href="#" data-title={sheet.properties.title} onClick={onClickSheetTitle}>{sheet.properties.title}</a>
          </React.Fragment>
        ))
      }</div>
      <div>{values && <Table values={values} />}</div>
    </>
  );
}
