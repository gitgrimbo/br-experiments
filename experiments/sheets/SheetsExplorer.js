import React from "react";

import uuid from "../common/uuid";

function Table({
  values,
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
  onClickCell,
}) {
  console.log("SheetsExplorer", title, sheets);

  const [values, setValues] = React.useState(null);

  const onClickSheetTitle = async (e) => {
    e.preventDefault();
    const idx = e.target.getAttribute("data-idx");
    const sheet = sheets[idx];
    setValues(sheet.values);
  };

  return (
    <>
      {title && <h3>{title}</h3>}
      <div>{
        sheets.map((sheet, i) => (
          <React.Fragment key={i}>
            {i > 0 ? " / " : null}
            <a href="#" data-idx={i} onClick={onClickSheetTitle}>{sheet.properties.title}</a>
          </React.Fragment>
        ))
      }</div>
      <div>{values && (
        <Table
          values={values}
          onClickCell={onClickCell}
        />
      )}</div>
    </>
  );
}
