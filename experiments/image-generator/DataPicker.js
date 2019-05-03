import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";

import Center from "../common/Center";
import HR from "../common/HR";
import SheetsExplorer from "../sheets/SheetsExplorer";
import { gapiLoad } from "../google/gapi";
import ErrorBox from "../common/ErrorBox";


function pick({
  clientId,
  apiKey,
  onPickerLoaded,
}) {
  return new Promise(async (resolve, reject) => {
    const scope = [
      "https://www.googleapis.com/auth/photos",
      "https://www.googleapis.com/auth/drive.file",
    ].join(" ");

    let pickerApiLoaded = false;
    let oauthToken;

    function pickerCallback(response) {
      console.log("pickerCallback", response);
      if (response.action === "loaded") {
        onPickerLoaded && onPickerLoaded(response);
      } else {
        resolve(response);
      }
    }

    // Create and render a Picker object for picking:
    // - user Photos.
    // - user Spreadsheets.
    function createPicker() {
      console.log("createPicker", pickerApiLoaded, oauthToken);
      if (pickerApiLoaded && oauthToken) {
        // get viewport size
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const picker = new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.PHOTOS)
          .addView(google.picker.ViewId.SPREADSHEETS)
          .addView(google.picker.ViewId.DOCS_IMAGES)
          .setOAuthToken(oauthToken)
          .setDeveloperKey(apiKey)
          .setCallback(pickerCallback)
          .setSize(vw * 0.9, vh * 0.9)
          .build();
        picker.setVisible(true);
      }
    }

    async function loadAuth2API() {
      function getAuthInstance() {
        if (typeof gapi !== "undefined" && typeof gapi.auth2 !== "undefined") {
          return gapi.auth2.getAuthInstance();
        }
        return null;
      }

      const authInstance = getAuthInstance();
      const isSignedIn = authInstance && authInstance.isSignedIn.get();
      if (isSignedIn) {
        if (!oauthToken) {
          oauthToken = authInstance.currentUser.get().getAuthResponse().access_token;
        }
        return;
      }

      await gapiLoad("auth2");
      const googleAuth = await gapi.auth2.init({ client_id: clientId });
      console.log("loadAuth2API", googleAuth);
      const result = await googleAuth.signIn({ scope: scope });
      console.log("loadAuth2API", result);
      const authResponse = result.getAuthResponse();
      if (authResponse && !authResponse.error) {
        oauthToken = authResponse.access_token;
      }
    }

    async function loadPickerAPI() {
      await gapiLoad("picker");
      pickerApiLoaded = true;
    }

    if (typeof gapi !== "object" || gapi === null) {
      reject(new Error("gapi not loaded"));
      return;
    }

    try {
      const auth2Promise = loadAuth2API();
      const pickerPromise = loadPickerAPI();
      await Promise.all([auth2Promise, pickerPromise]);
      console.log("apis loaded");
      console.log("creating picker");
      createPicker();
    } catch (err) {
      console.error("Error selecting Google document");
      console.error(err);
      reject(err);
    }
  });
}


function SheetValuePicker({
  sampleData,
  onSave,
}) {
  const [sheetIdx, setSheetIdx] = React.useState(0);
  const sheet = sampleData && sampleData[sheetIdx];
  return (
    <>
      <select
        value={sheetIdx}
        onChange={(e) => setSheetIdx(Number(e.target.value))}
      >
        {
          sampleData && sampleData.map(({ title }, i) => (
            <option key={i} value={i}>{title}</option>
          ))
        }
      </select>
      {sheet && (
        <div style={{ marginTop: "1em" }}>
          <SheetsExplorer
            sheets={sheet.sheets}
            cellPadding="0.5em"
            onClickCell={(value) => onSave && onSave(value)}
          />
        </div>
      )}
    </>
  );
}


function GoogleDocPicker({
  clientId,
  apiKey,
  onSave,
}) {
  const [error, setError] = React.useState(null);

  function extractPicasaUrl(doc) {
    // https://stackoverflow.com/a/47315488/319878
    if (!doc.thumbnails) {
      return null;
    }
    const [th] = doc.thumbnails;
    if (!th) {
      return null;
    }
    const parts = th.url.split("/");
    parts[parts.length - 2] = "s0";
    return parts.join("/");
  }

  const onClickGoogleDoc = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const picked = await pick({
        clientId,
        apiKey,
      });
      console.log("onClickGoogleDoc", picked);
      if (picked.action === "picked") {
        const [doc] = picked.docs;
        let url = doc.url;
        if (doc.serviceId === "picasa") {
          url = extractPicasaUrl(doc);
        }
        onSave && onSave(url);
      } else {
        const err = (picked.action === "cancel")
          ? {
            title: "Cancelled",
            message: "Cancelled picking file",
          }
          : {
            message: picked.action,
          };
        setError(err);
      }
    } catch (err) {
      console.error("onClickGoogleDoc");
      console.error(err);
      setError({
        message: String(err.error || err.message || err),
      });
    }
  };

  return (
    <>
      <Center>
        <Button variant="contained" onClick={onClickGoogleDoc}>Pick File</Button>
      </Center>
      {error && (
        <>
          <br />
          <ErrorBox
            title={error.title || "Error picking file"}
            error={error.message}
          />
        </>
      )}
    </>
  );
}


function DataPicker({
  visible,
  sampleData,
  onSave,
  onRequestClose,
  clientId,
  apiKey,
}) {
  const [tabIdx, setTabIdx] = React.useState(0);
  console.log("tabIdx", tabIdx);

  const sources = [
    {
      label: "Google Picker",
      component: GoogleDocPicker,
    },
    {
      label: "Data",
      component: SheetValuePicker,
    },
  ];
  const source = sources[tabIdx];
  const SourceComponent = source && source.component;

  return (
    <Dialog
      open={visible}
      onClose={onRequestClose}
      style={{
        zIndex: 999,
      }}
    >
      <>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" color="inherit">Pick Data</Typography>
          </Toolbar>
        </AppBar>
        <Tabs
          value={tabIdx || 0}
          onChange={(e, value) => setTabIdx(value)}
        >
          {sources && (
            sources.map((source, i) => <Tab key={i} label={source.label}></Tab>)
          )}
        </Tabs>
        <div style={{ padding: "0.5em" }}>
          <br />
          {source && (
            <SourceComponent
              sampleData={sampleData}
              clientId={clientId}
              apiKey={apiKey}
              onSave={onSave}
            />
          )}
          <HR />
          <Center>
            <Button variant="contained" onClick={onRequestClose}>
              Close<CancelIcon
                style={{
                  marginLeft: "0.5em",
                }}
              />
            </Button>
          </Center>
        </div>
      </>
    </Dialog>
  );
}

export {
  GoogleDocPicker,
  SheetValuePicker,
};
export default DataPicker;
