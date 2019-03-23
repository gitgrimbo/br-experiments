import { initGoogleClient } from "./gapi";

export function initGoogleSheets({
  apiKey,
  clientId,
  discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope = "https://www.googleapis.com/auth/spreadsheets.readonly",
  onSignInChanged,
}): Promise<void> {
  return initGoogleClient({
    apiKey,
    clientId,
    discoveryDocs,
    scope,
    onSignInChanged,
  });
}

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

export async function getValuesFromSheet(spreadsheetId, title, cellRange = "A1:Z500"): Promise<any[][]> {
  // A1:Z100 used just to try and get all values
  const range = `${title}!${cellRange}`;
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  console.log(response);
  return response.result.values;
}

export interface LoadedSpreadsheet {
  title: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  raw: gapi.client.sheets.Spreadsheet;
  sheets: {
    properties: gapi.client.sheets.SheetProperties;
    values: any[][];
  }[];
}

export async function loadSpreadsheet(
  apiKey: string,
  clientId: string,
  spreadsheetId: string,
  onProgress: (string) => void,
): Promise<LoadedSpreadsheet> {
  onProgress && onProgress("Loading Google Sheets API");
  await initGoogleSheets({
    apiKey,
    clientId,
    onSignInChanged() {
      // no-op
    },
  });

  ensureProperty(window, "gapi.client.sheets.spreadsheets");

  onProgress && onProgress("Loading spreadsheet");

  const response = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId,
  });

  onProgress && onProgress("Spreadsheet loaded");

  const sheets = await Promise.all(
    response.result.sheets.map(async (sheet, idx) => {
      onProgress && onProgress(`Loading sheet ${idx + 1}/${response.result.sheets.length}`);
      return {
        properties: sheet.properties,
        values: await getValuesFromSheet(spreadsheetId, sheet.properties.title),
      };
    })
  );

  onProgress && onProgress(`${response.result.sheets.length} sheets loaded`);

  return {
    title: response.result.properties.title,
    spreadsheetId: response.result.spreadsheetId,
    spreadsheetUrl: response.result.spreadsheetUrl,
    raw: response.result,
    sheets,
  };
}
