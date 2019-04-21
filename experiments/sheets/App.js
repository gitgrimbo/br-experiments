import React from "react";

import ClickableFieldset from "../common/ClickableFieldset";
import Sheets from "../google/sheets";
import ErrorBox from "../common/ErrorBox";
import SheetsExplorer from "./SheetsExplorer";
import { GoogleSignInButton } from "./GoogleSignInButton";

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
      If you cannot see the sheet, try <GoogleSignInButton/> to revalidate permissions
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
