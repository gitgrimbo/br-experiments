import * as React from "react";

import AsyncButton from "../common/AsyncButton";
import Sheets from "../google/sheets";

function ensureProperty(ob, property): boolean {
  const parts = property.split(".");
  let curProp = "";
  for (const p of parts) {
    if (typeof ob[p] === "undefined") {
      throw new Error(`${curProp} not loaded`);
    }
    console.log(p, ob[p]);
    curProp += (curProp ? "." : "") + p;
    ob = ob[p];
  }
  return true;
}

async function getValuesFromSheet(spreadsheetId, title, cellRange = "A1:Z500"): Promise<any[][]> {
  // A1:Z100 used just to try and get all values
  const range = `${title}!${cellRange}`;
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  console.log(response);
  return response.result.values;
}

async function loadSpreadsheet(apiKey, clientId, spreadsheetId, onProgress) {
  onProgress && onProgress("Loading Google Sheets API");
  await Sheets.initGoogleSheets({
    apiKey,
    clientId,
  });
  ensureProperty(window, "gapi.client.sheets.spreadsheets");
  onProgress && onProgress("Loading sheet");
  const response = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId,
  });
  console.log(response);
  const sheets = await Promise.all(
    response.result.sheets.map(async (sheet) => ({
      properties: sheet.properties,
      values: await getValuesFromSheet(spreadsheetId, sheet.properties.title),
    }))
  );
  return {
    title: response.result.properties.title,
    spreadsheetId: response.result.spreadsheetId,
    spreadsheetUrl: response.result.spreadsheetUrl,
    raw: response.result,
    sheets,
  };
};

export default function GoogleSheetsDataLoader({
  inititialSpreadsheetId,
  apiKey,
  clientId,
  onSpreadsheetLoaded,
}) {
  console.log("GoogleSheetsDataLoader", clientId, apiKey, inititialSpreadsheetId);

  const [spreadsheetId, setSpreadsheetId] = React.useState(inititialSpreadsheetId);
  const [loadProgress, setLoadProgress] = React.useState(null);
  const [loadError, setLoadError] = React.useState(null);

  const onClickLoadData = async (e) => {
    setLoadError(null);
    if (spreadsheetId) {
      try {
        const spreadsheet = await loadSpreadsheet(apiKey, clientId, spreadsheetId, setLoadProgress);
        setLoadProgress(null);
        console.log(spreadsheet);
        onSpreadsheetLoaded && onSpreadsheetLoaded(spreadsheet);
      } catch (err) {
        console.error("onClickLoadData");
        console.error(err);
        setLoadError(err);
      }
    }
  };

  return (
    <>
      <AsyncButton onClick={onClickLoadData}>Load</AsyncButton>
      {" "}
      Sheet id: <input size={24} value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)} />
      {loadProgress && <div>{loadProgress}</div>}
      {loadError && <div>{String(loadError)}</div>}
    </>
  );
}

export function makeSource({
  inititialSpreadsheetId,
  apiKey,
  clientId,
  onSpreadsheetLoaded,
}) {
  return {
    title() {
      return "Google Sheets";
    },
    component() {
      return <GoogleSheetsDataLoader
        apiKey={apiKey}
        clientId={clientId}
        inititialSpreadsheetId={inititialSpreadsheetId}
        onSpreadsheetLoaded={onSpreadsheetLoaded}
      />;
    },
  };
}
