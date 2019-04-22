import React from "react";
import Sortable from "sortablejs";

import isListItem from "./isListItem";
import minMax from "../common/minMax";
import preventDefault from "../common/preventDefault";

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
  initialValue,
  isEditing,
  sampleData,
  onEdit,
  onSave,
  onCancel,
}) {
  const [value, setValue] = React.useState(initialValue);

  const doSave = () => {
    console.log("doSave");
    onSave && onSave(value);
  };

  const doCancel = () => {
    console.log("doCancel");
    setValue(initialValue);
    onCancel && onCancel();
  };

  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onChangeValue = preventDefault((e) => setValue(e.target.value));
  const onClickSave = preventDefault(doSave);
  const onClickCancel = preventDefault(doCancel);

  const onKeyDownValue = (...args) => {
    const [e] = args;
    const handlers = {
      Enter: doSave,
      Escape: doCancel,
    };
    const handler = handlers[e.key];
    if (handler) {
      e.preventDefault();
      handler(...args);
    }
  };

  const onClickText = (e) => {
    if (!isEditing) {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        value={value || ""}
        onClick={onClickText}
        onChange={onChangeValue}
        onKeyDown={onKeyDownValue}
        size="16"
      />
      {
        isEditing && sampleData && (
          <div>
            <select onChange={onChangeValue}>
              {sampleData.map((item, i) => <option key={i} value={item}>{item}</option>)}
            </select>
          </div>
        )
      }
      {
        isEditing && (
          <div>
            <button onClick={onClickSave}>Save</button>
            {" "}
            <button onClick={onClickCancel}>Cancel</button>
          </div>
        )
      }
    </>
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
  onChange,
  idFormatter,
}) {
  const [editing, setEditing] = React.useState();
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
    onChange({
      type: "item",
      idx,
      name,
      value,
    });
  };

  const onSave = (idx, name) => (value) => {
    onChange({
      type: "item",
      idx,
      name,
      value,
    });
    setEditing(null);
  };

  const onCancel = () => {
    setEditing(null);
  };

  const makeSampleDataForFields = () => {
    if (!sampleData) {
      return null;
    }
    if (!data) {
      return null;
    }
    return data.map(({ id }) => {
      const found = Object.keys(sampleData).find((sampleDataKey) => {
        if (id === sampleDataKey) {
          return true;
        }
        const listItem = isListItem(id);
        if (listItem && listItem.name === sampleDataKey) {
          return true;
        }
        return false;
      });
      return found ? sampleData[found] : null;
    });
  };

  const sampleDataForFields = makeSampleDataForFields();

  const headingCells = () => {
    if (!data || !data[0]) {
      return null;
    }
    const keysWithoutId = Object.keys(data[0]).filter((key) => key !== "id");
    // first cell is for dragging row
    return ["", "id"].concat(keysWithoutId).map((name, i) => <th key={i}>{name}</th>);
  };

  const dataCells = (item, idx) => {
    const { id, ...fields } = item;
    const isEditing = (editing === idx);
    const listItem = isListItem(id);
    return (
      <>
        {
          listItem
            ? <td
              className="draghandle"
              onClick={onClickSortHandle(listItem.name)}
              style={{ color: sortableGroup === listItem.name ? "red" : "" }}
            >&#x21c5;</td>
            : <td></td>
        }
        <td>{idFormatter ? idFormatter(id) : id}</td>
        {
          Object.keys(fields).map((name, i) => {
            const value = fields[name];
            return (
              <td key={i} data-idx={idx}>
                {
                  // using key={isEditing + idx} means the component is considered new if it switches from edit mode to non-edit mode
                  (typeof value === "boolean")
                    ? <input
                      type="checkbox"
                      data-idx={idx}
                      name={name}
                      checked={value}
                      onChange={_onChange}
                      disabled={!isEditing}
                    />
                    : <EditableText
                      key={isEditing + idx}
                      initialValue={value}
                      sampleData={sampleDataForFields && sampleDataForFields[idx]}
                      isEditing={isEditing}
                      onEdit={() => setEditing(idx)}
                      onSave={onSave(idx, name)}
                      onCancel={onCancel}
                    />
                }
              </td>
            );
          })
        }
      </>
    );
  };

  return (
    <>
      <style>{cssNoSelect}</style>
      <table>
        <thead>
          <tr>
            {headingCells()}
          </tr>
        </thead>
        <tbody ref={sortableRef}>
          {data && data.map((item, idx) => {
            const listItem = isListItem(item.id);
            return (
              <tr key={idx + "." + lastMoved[idx]} data-idx={idx} data-id={item.id} data-group={listItem && listItem.name} data-group-idx={listItem && listItem.idx}>
                {dataCells(item, idx)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
