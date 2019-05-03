import React from "react";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import DragIndicator from "@material-ui/icons/DragIndicator";
import EditIcon from "@material-ui/icons/Edit";
import Sortable from "sortablejs";

import minMax from "../common/minMax";
import preventDefault from "../common/preventDefault";

import isListItem from "./isListItem";
import DataPicker from "./DataPicker";

const cssNoSelect = `
.draghandle {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  cursor: move;
  cursor: -webkit-grabbing;
}`;

function EditableText({
  label,
  initialValue,
  onSave,
  onCancel,
}) {
  const [value, setValue] = React.useState(initialValue);

  const onChangeValue = preventDefault((e) => {
    console.log("EditableText.onChangeValue", "e.target.value", e.target.value);
    setValue(e.target.value)
  });

  const save = () => {
    console.log("EditableText.save", "value", value, "initialValue", initialValue);
    onSave && onSave(value)
  };

  const cancel = () => {
    setValue(initialValue);
    onCancel && onCancel();
  };

  const onKeyDownValue = (...args) => {
    const [e] = args;
    const handlers = {
      Enter() { save(); },
      Escape() { cancel(); },
    };
    const handler = handlers[e.key];
    if (handler) {
      e.preventDefault();
      handler(...args);
    }
  };

  return (
    <TextField
      label={label}
      fullWidth
      value={value || ""}
      onChange={onChangeValue}
      onKeyDown={onKeyDownValue}
      onBlur={save}
    />
  );
}

function useLastMoved(len, initialValue) {
  const now = initialValue || Date.now();

  const initialValues = [];
  for (let i = 0; i < len; i++) {
    initialValues.push(now);
  }
  const [lastMoved, setLastMoved] = React.useState(initialValues);

  return [
    lastMoved,
    (oldIndex, newIndex) => {
      const now = Date.now();
      const [min, max] = minMax(oldIndex, newIndex);
      const lastMoved2 = lastMoved.slice();
      for (let i = min; i <= max; i++) {
        lastMoved2[i] = now;
      }
      setLastMoved(lastMoved2);
    },
  ];
}

function Flex({ children, flex = 1 }) {
  return <div style={{ flex }}>{children}</div>;
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
  //console.log("DataInput.render", JSON.stringify(data, 2, null));

  const [showEditor, setShowEditor] = React.useState(null);
  const [lastMoved, updateLastMoved] = useLastMoved(data.length, Date.now());

  const [sortableGroup, setSortableGroup] = React.useState(null);
  const sortableRef = React.useRef();
  const onClickSortHandle = (group) => (e) => {
    if (sortableRef.current && data) {
      const sortable = Sortable.create(sortableRef.current, {
        group,
        draggable: `[data-group='${group}']`,
        handle: '.draghandle',
        animation: 150,
        onSort(e) {
          sortable.destroy();
          const { oldIndex, newIndex } = e;
          onChange({
            type: "move",
            oldIndex,
            newIndex,
          });
          // for some reason the id cells don't get re-rendered properly without changing the React key
          updateLastMoved(oldIndex, newIndex);
          setSortableGroup(null);
        },
      });
      setSortableGroup(group);
    }
  };

  const _onChange = (e) => {
    e.preventDefault();
    const { target } = e;
    const idx = Number(target.dataset["idx"]);
    const value = (target.type.toLowerCase() === "checkbox")
      ? target.checked
      : target.value;
    const name = target.name;
    console.log("DataInput.onChange", idx, name, value);
    onChange({
      type: "item",
      idx,
      name,
      value,
    });
  };

  const onSave = (idx, name) => (value) => {
    console.log("DataInput.onSave", idx, name, value);
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
      <style>{cssNoSelect}</style>
      <ul
        ref={sortableRef}
        style={{ listStyleType: "none", margin: 0, padding: 0 }}
      >
        {data && data.map((item, idx) => {
          const { id, ...fields } = item;
          const listItem = isListItem(id);
          const name = "value";
          const value = simpleValueSupplier ? simpleValueSupplier(item) : null;
          return (
            <li
              key={idx + "." + lastMoved[idx]}
              data-idx={idx}
              data-id={item.id}
              data-group={listItem && listItem.name}
              data-group-idx={listItem && listItem.idx}
              style={{ padding: "0.2em" }}
            >
              <div style={{ display: "flex" }}>
                {
                  listItem
                    ? (
                      <div
                        style={{
                          padding: "0.5em",
                        }}
                      >
                        <DragIndicator
                          className="draghandle"
                          onClick={onClickSortHandle(listItem.name)}
                          style={{
                            color: sortableGroup === listItem.name ? "red" : "",
                          }}
                        />
                      </div>
                    )
                    : null
                }
                {
                  (typeof value === "undefined")
                    ? <Flex><Button variant="contained" style={{ width: "100%" }}>{id}</Button></Flex>
                    : (typeof value === "boolean")
                      ? <Flex>
                        <input
                          type="checkbox"
                          data-idx={idx}
                          name={name}
                          checked={value}
                          onChange={_onChange}
                        />
                      </Flex>
                      : <>
                        <Flex>
                          <EditableText
                            label={id}
                            initialValue={value}
                            sampleData={sampleData}
                            onSave={onSave(idx, name)}
                          />
                        </Flex>
                        <Flex flex="0">
                          <Fab aria-label="Edit" size="small" onClick={() => setShowEditor(idx)}>
                            <EditIcon />
                          </Fab>
                        </Flex>
                      </>
                }
              </div>
            </li>
          );
        })}
      </ul>
      {console.log(data, showEditor, data && data[showEditor])}
      <DataPicker
        visible={typeof showEditor === "number"}
        onRequestClose={() => setShowEditor(null)}
        onSave={onSave(showEditor, "value")}
        sampleData={sampleData}
        clientId={"459216665265-rg4ujqcjinpgo3dlgqaori593ufgr8vr.apps.googleusercontent.com"}
        apiKey={"AIzaSyDfg7q3EAFMU4Z1yNRT_hceC5qLWYob40k"}
      />
    </>
  );
}
