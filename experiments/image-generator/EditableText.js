import React from "react";
import TextField from "@material-ui/core/TextField";
import preventDefault from "../common/preventDefault";

export default function EditableText({
  label,
  value,
  useLocalValue,
  onChange,
  onSave,
  onCancel,
}) {
  const [localValue, setLocalValue] = React.useState(value || "");

  console.log("EditableText", value, localValue);

  const onChangeValue = preventDefault((e) => {
    console.log("EditableText.onChangeValue", "e.target.value", e.target.value);
    setLocalValue(e.target.value);
    onChange && onChange(e.target.value);
  });

  const save = () => {
    console.log("EditableText.save", "value", value, "localValue", localValue);
    onSave && onSave(localValue);
  };

  const cancel = () => {
    setLocalValue(value);
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
      value={useLocalValue ? localValue : value}
      onChange={onChangeValue}
      onKeyDown={onKeyDownValue}
      onBlur={save}
    />
  );
}
