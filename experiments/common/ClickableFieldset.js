import React from "react";

export default function ClickableFieldset({
  legend,
  children,
}) {
  const [visible, setVisible] = React.useState(true);
  const onClick = (e) => setVisible(!visible);
  return (
    <fieldset>
      <legend><a href="#" onClick={onClick}>{legend}</a></legend>
      <div>{visible && children}</div>
    </fieldset>
  );
}
