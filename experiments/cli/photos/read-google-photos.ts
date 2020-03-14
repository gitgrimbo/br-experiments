/*

Unfortunately this doesn't work.

Service accounts are not supported in Google Photos library API.

So even enabingenabling Photos with the service account:
  https://console.developers.google.com/apis/api/photoslibrary.googleapis.com/overview?project=bladerunners

does not work and give this error when trying to read from a shared album:

"error": {
  "code": 403,
  "message": "Service accounts are not supported.",
  "status": "PERMISSION_DENIED"
}

*/

import { promises as fsp } from "fs";
import fetch from "node-fetch";
import auth from "../google-auth-helper";

async function listPhotos({
  credentialsFile = null,
  albumId = null,
}) {
  const bladerunnersFacesAlbumId = "ABvBuvjUW2QY3h-VAuZpYdnH0VMtAZD3nMkJ6upG2W04I4xBhNc2fpdiH6ov-ZNpu8lxOau-2KeM";

  credentialsFile = credentialsFile || "bladerunners-service-account-creds.json";
  albumId = albumId || bladerunnersFacesAlbumId;

  const creds = JSON.parse(await fsp.readFile(credentialsFile, "utf8"));

  const scopes = [
    "https://www.googleapis.com/auth/photoslibrary.readonly",
  ];

  const authResp = await auth(creds, scopes);
  console.log(authResp);

  const authHeader = `Bearer ${authResp.tokens.access_token}`;
  console.log(authHeader);

  const resp = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
    method: "POST",
    headers: {
      "Authorization": authHeader,
    },
    body: JSON.stringify({
      "pageSize": "100",
      "albumId": albumId,
    }),
  });
  console.log(resp);
  console.log(await resp.text());
}

async function main({
  credentialsFile = null,
  albumId = null,
}) {
  const info = await listPhotos({
    credentialsFile,
    albumId,
  });
}

const [credentialsFile] = process.argv.slice(2);
main({
  credentialsFile,
}).catch((err) => console.error(err));
