import React from "react";

import preventDefault from "../common/preventDefault";
import uuid from "../common/uuid";

function Table({
  values,
  cellPadding = "0",
  onClickCell,
}) {
  const onClick = (e) => {
    const { target } = e;
    if (target.tagName === "TD") {
      onClickCell && onClickCell(target.innerText, target.dataset.rowIndex, target.dataset.index);
    }
  };

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
  padding: ${cellPadding};
}
      `}</style>
      <table className={className} cellSpacing="0" cellPadding="0" onClick={onClick}>
        <tbody>
          {
            values.map((row, rowIdx) => (
              <tr key={rowIdx} data-index={rowIdx}>
                {
                  row.map((cell, cellIdx) => <td key={cellIdx} data-index={cellIdx} data-row-index={rowIdx}>{cell}</td>)
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
  title,
  sheets,
  cellPadding,
  onClickCell,
}) {
  console.log("SheetsExplorer", title, sheets);

  const [sheetIdx, setSheetIdx] = React.useState(0);

  const onChangeSheetIdx = preventDefault((e) => setSheetIdx(Number(e.target.value)));

  const sheet = sheets && sheets[sheetIdx];

  return (
    <>
      {title && <h3>{title}</h3>}
      <div>
        <select value={sheetIdx} onChange={onChangeSheetIdx}>{
          sheets.map((sheet, i) => (
            <option key={i} value={i}>{sheet.properties.title}</option>
          ))
        }</select>
      </div>
      <div style={{ marginTop: "1em" }}>
        {sheet && sheet.values &&  (
          <Table
            values={sheet.values}
            cellPadding={cellPadding}
            onClickCell={onClickCell}
          />
        )}
      </div>
    </>
  );
}
