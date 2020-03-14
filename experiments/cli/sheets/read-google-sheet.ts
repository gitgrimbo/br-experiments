/*

npx ts-node read-google-sheet.ts [credentialsFile] [spreadsheetId]

credentialsFile is a JSON file that is download from the "Credentials/Service Accounts" part of Google Console:
  https://console.developers.google.com/apis/credentials?folder=&organizationId=&project=bladerunners

There is a service account specifically set up for Bladerunners Experiments CLI
  https://console.developers.google.com/iam-admin/serviceaccounts/details/113087166910947592888?project=bladerunners

spreadsheetId is exactly that.

*/

import { google, sheets_v4 } from "googleapis";
import { promises as fsp } from "fs";
import auth from "../google-auth-helper";

async function getSpreadsheetInfo({
  credentialsFile = null,
  spreadsheetId = null,
}) {
  const bladerunners2020spreadsheetId = "1kjQZXy-m_ioxhJxHWC5PdeqeIBLsavHWVbq38Fz9ou4";

  credentialsFile = credentialsFile || "bladerunners-service-account-creds.json";
  spreadsheetId = spreadsheetId || bladerunners2020spreadsheetId;

  const creds = JSON.parse(await fsp.readFile(credentialsFile, "utf8"));

  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ];

  await auth(creds, scopes);

  const { spreadsheets } = google.sheets({
    version: "v4",
  });

  const sheetInfoResp = await spreadsheets.get({
    spreadsheetId,
  });

  const { sheets } = sheetInfoResp.data;
  const sheetProperties = sheets.map((sheet) => sheet.properties)

  function fullRange(sheetProperties: sheets_v4.Schema$SheetProperties) {
    const { gridProperties, } = sheetProperties;
    const { columnCount, rowCount } = gridProperties;
    const A = 65;
    const colName = (colNumber) => String.fromCharCode(A + colNumber - 1);
    const start = "A1";
    const end = `${colName(columnCount)}${rowCount}`;
    return `${sheetProperties.title}!${start}:${end}`;
  }

  const valuesRequests = sheetProperties
    .map((sheetProperties) => {
      return spreadsheets.values.get({
        spreadsheetId,
        range: fullRange(sheetProperties),
      });
    });

  const valuesResps = await Promise.all(valuesRequests);

  return {
    spreadsheet: sheetInfoResp.data,
    sheetValues: valuesResps.map((valuesResp) => valuesResp.data),
  };
}

async function main({
  credentialsFile = null,
  spreadsheetId = null,
}) {
  const info = await getSpreadsheetInfo({
    credentialsFile,
    spreadsheetId,
  });
  console.log("\n\nSPREADSHEET\n");
  console.log(info.spreadsheet.spreadsheetId);
  console.log(info.spreadsheet.properties.title);

  console.log("\n\nSHEETS\n");
  info.spreadsheet.sheets.forEach((sheet, sheetIdx) => {
    console.log(`\nSheet[${sheetIdx}]`, sheet.properties.title);
    const sheetValues = info.sheetValues[sheetIdx];
    console.log(sheetValues.values.map((values) => values.join(" | ")).join("\n"));
  });
}

const [credentialsFile] = process.argv.slice(2);
main({
  credentialsFile,
}).catch((err) => console.error(err));
