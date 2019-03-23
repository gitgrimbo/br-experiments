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
import * as picker from "../google/picker";
import SheetsExplorer from "../sheets/SheetsExplorer";
import ErrorBox from "../common/ErrorBox";


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

  const onClickGoogleDoc = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const picked = await picker.pick({
        clientId,
        apiKey,
      });
      console.log("onClickGoogleDoc", picked);
      if (picked.action === "picked") {
        const [doc] = picked.docs;
        const url = picker.extractPublicImageUrl(doc) || doc.url;
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
      label: "Data",
      component: SheetValuePicker,
    },
    {
      label: "Google Picker",
      component: GoogleDocPicker,
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
