import * as React from "react";

import AsyncButton from "../common/AsyncButton";
import { loadSpreadsheet, LoadedSpreadsheet } from "../google/sheets";

interface GoogleSheetsDataLoaderProps {
  inititialSpreadsheetId: string;
  apiKey: string;
  clientId: string;
  onSpreadsheetLoaded: (LoadedSpreadsheet) => void;
}

export default function GoogleSheetsDataLoader({
  inititialSpreadsheetId,
  apiKey,
  clientId,
  onSpreadsheetLoaded,
}: GoogleSheetsDataLoaderProps): React.ReactElement | null {
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

export interface DataSource {
  title: () => string;
  component: () => React.ReactElement;
}

export function makeSource({
  inititialSpreadsheetId,
  apiKey,
  clientId,
  onSpreadsheetLoaded,
}): DataSource {
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
  } as DataSource;
}
