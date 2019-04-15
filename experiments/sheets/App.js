import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import uuid from "../common/uuid";
import Sheets from "../google/sheets";
import ErrorBox from "../common/ErrorBox";

function Table({ values }) {
  const className = `cls-${uuid()}`;
  return values && (
    <>
      <style>{`
table.${className} {
  padding: 0;
  margin: 0;
  border-collapse: collapsed;
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

function SheetsExplorer({
  spreadsheetId,
  sheets,
}) {
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

function App({
  apiKey,
  clientId,
  spreadsheetId,
}) {
  const [inputSpreadsheetId, setInputSpreadsheetId] = React.useState(spreadsheetId);
  const [spreadsheet, setSpreadsheet] = React.useState(null);
  const [error, setError] = React.useState(null);

  const onSignInChanged = (e) => console.log(e);

  const loadSpreadsheet = async (spreadsheetId) => {
    setSpreadsheet("Loading Spreadsheet");
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId,
      });
      setSpreadsheet(response.result)
    } catch (err) {
      setSpreadsheet(null);
      throw err;
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        await Sheets.initGoogleSheets({
          apiKey,
          clientId,
          onSignInChanged,
        });
        if (spreadsheetId) {
          await loadSpreadsheet(spreadsheetId);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      }
    })();
  }, []);

  const onClickLoad = async (e) => {
    try {
      await loadSpreadsheet(inputSpreadsheetId);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };

  return (
    <>
      If you cannot see the sheet, try <button onClick={(e) => gapi.auth2.getAuthInstance().signIn()}>Signing In</button> to revalidate permissions
      <ClickableFieldset legend="Spreadsheet Info">
        <table>
          <tbody>
            <tr>
              <td>Id</td>
              <td><button onClick={onClickLoad}>Load</button><input type="text" value={inputSpreadsheetId} onChange={(e) => setInputSpreadsheetId(e.target.value)} size="64" /></td>
            </tr>
            {
              spreadsheet && (
                (typeof spreadsheet === "string")
                  ? <tr><td colSpan="99">{spreadsheet}</td></tr>
                  :
                  <>
                    <tr><td valign="top">Url</td><td><a href={spreadsheet.spreadsheetUrl}>{spreadsheet.spreadsheetUrl}</a></td></tr>
                    <tr><td>Title</td><td>{spreadsheet.properties.title}</td></tr>
                    <tr><td valign="top">Sheets</td><td><SheetsExplorer spreadsheetId={spreadsheetId} sheets={spreadsheet.sheets} /></td></tr>
                  </>
              )
            }
          </tbody>
        </table>
      </ClickableFieldset>
      {error && <ErrorBox error={error.message || (error.result && error.result.error && error.result.error.message)} />}
    </>
  );
}

export default App;
