import {
  googToPromise,
  initGoogleClient,
} from "./gapi";

function initGoogleSheets({
  apiKey,
  clientId,
  discoveryDocs = ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  scope = "https://www.googleapis.com/auth/spreadsheets.readonly",
  onSignInChanged,
}) {
  return initGoogleClient({
    apiKey,
    clientId,
    discoveryDocs,
    scope,
    onSignInChanged,
  });
}

export default {
  initGoogleSheets,
};
