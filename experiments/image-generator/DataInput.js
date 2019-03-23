import React from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";

import DataPicker from "./DataPicker";
import EditableText from "./EditableText";

function Flex({ children, flex = 1 }) {
  return <div style={{ flex }}>{children}</div>;
}

function DataInputItem({
  idx,
  item,
  simpleValueSupplier,
  sampleData,
  makeOnSave,
  setShowEditor,
}) {
  const [dirty, setDirty] = React.useState(false);

  const { id, ...fields } = item;
  const name = "value";
  const value = simpleValueSupplier ? simpleValueSupplier(item) : null;
  console.log("DataInputItem", idx, item, value);

  const renderUndefinedValue = () => <Flex><Button variant="contained" style={{ width: "100%" }}>{id}</Button></Flex>

  const renderBooleanValue = () => (
    <Flex>
      <input
        type="checkbox"
        data-idx={idx}
        name={name}
        checked={value}
        onChange={_onChange}
      />
    </Flex>
  );

  const renderTextValue = () => (
    <>
      <Flex>
        <EditableText
          label={id}
          value={value}
          sampleData={sampleData}
          useLocalValue={dirty}
          onChange={(value) => setDirty(true)}
          onSave={(value) => {
            setDirty(false);
            makeOnSave(idx, name)(value);
          }}
        />
      </Flex>
      <Flex flex="0">
        <Fab aria-label="Edit" size="small" onClick={
          () => setShowEditor({
            idx,
            onSaveCallback: () => setDirty(false),
          })
        }>
          <EditIcon />
        </Fab>
      </Flex>
    </>
  );

  return (
    <li
      data-idx={idx}
      data-id={item.id}
      style={{ padding: "0.2em" }}
    >
      <div style={{ display: "flex" }}>
        {
          (typeof value === "undefined")
            ? renderUndefinedValue()
            : (typeof value === "boolean")
              ? renderBooleanValue()
              : renderTextValue()
        }
      </div>
    </li>
  );
}

/**
 * Displays an editable grid of data.
 *
 * @param {Object} props
 * @param {Object[]} props.data
 *   The data array. Each data item must have at least an "id" field.
 * @param {Function} props.onChange
 *   Callback for any data changes.
 */
export default function DataInput({
  data,
  sampleData,
  simpleValueSupplier,
  onChange,
}) {
  console.log("DataInput.render", JSON.stringify(data, 2, null));

  const [showEditor, setShowEditor] = React.useState(null);

  const makeOnSave = (idx, name) => (value) => {
    console.log("DataInput.makeOnSave", idx, name, value);
    setShowEditor(null);
    onChange({
      type: "item",
      idx,
      name,
      value,
    });
  };

  return (
    <>
      <ul
        style={{ listStyleType: "none", margin: 0, padding: 0 }}
      >
        {data && data.map((item, idx) => {
          return <DataInputItem
            key={idx}
            idx={idx}
            item={item}
            simpleValueSupplier={simpleValueSupplier}
            sampleData={sampleData}
            makeOnSave={makeOnSave}
            setShowEditor={setShowEditor}
          />;
        })}
      </ul>
      {console.log(data, showEditor, data && showEditor && data[showEditor.idx])}
      <DataPicker
        visible={Boolean(showEditor)}
        onRequestClose={() => setShowEditor(null)}
        onSave={(value) => {
          showEditor.onSaveCallback();
          makeOnSave(showEditor.idx, "value")(value);
        }}
        sampleData={sampleData}
        clientId={"459216665265-rg4ujqcjinpgo3dlgqaori593ufgr8vr.apps.googleusercontent.com"}
        apiKey={"AIzaSyDfg7q3EAFMU4Z1yNRT_hceC5qLWYob40k"}
      />
    </>
  );
}
