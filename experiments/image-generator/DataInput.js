import React from "react";

function EditableText({ initialValue, isEditing, sampleData, onEdit, onSave, onCancel }) {
  const [value, setValue] = React.useState(initialValue);

  const onChangeValue = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const onClickText = (e) => {
    console.log(e);
    if (!isEditing) {
      e.preventDefault();
      onEdit();
    }
  };

  const onClickSave = (e) => {
    e.preventDefault();
    onSave && onSave(value);
  };

  const onClickCancel = (e) => {
    e.preventDefault();
    onCancel && onCancel();
  };

  return (
    <>
      <input type="text" value={value || ""} onClick={onClickText} onChange={onChangeValue} readOnly={!isEditing} />
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

/**
 * Displays an editable grid of data.
 *
 * @param {Object} props
 * @param {Object[]} props.data
 *   The data array. Each data item must have at least an "id" field.
 * @param {Function} props.onChange
 *   Callback for any data changes.
 */
export default function DataInput({ data, sampleData, onChange }) {
  const [editing, setEditing] = React.useState();

  const _onChange = (e) => {
    e.preventDefault();
    const { target } = e;
    const idx = Number(target.dataset["idx"]);
    const value = (target.type.toLowerCase() === "checkbox")
      ? target.checked
      : target.value;
    const name = target.name;
    onChange(idx, name, value);
  };

  const onSave = (idx, name) => (value) => {
    onChange(idx, name, value);
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
        if (id.startsWith(sampleDataKey)) {
          const remaining = id.substring(sampleDataKey.length);
          if (/^\.\d+$/.exec(remaining)) {
            // only a dot and digits left
            return true;
          }
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
    return ["id"].concat(keysWithoutId).map((name, i) => <th key={i}>{name}</th>);
  };

  const dataCells = (item, idx) => {
    const { id, ...fields } = item;
    const isEditing = (editing === idx);
    return (
      <>
        <td>{id}</td>
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
                      sampleData={sampleDataForFields[idx]}
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
    )
  };

  return (
    <table>
      <tbody>
        <tr>
          {headingCells()}
        </tr>
        {data && data.map((item, idx) => (
          <tr key={idx}>
            {dataCells(item, idx)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
