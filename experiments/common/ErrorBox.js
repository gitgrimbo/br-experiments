import React from "react";

export default function ErrorBox({
  error,
  title,
  inline = false,
}) {
  const cssOuter = {
    border: "solid 2px red",
    padding: "0.5em",
    background: "lightyellow",
    fontWeight: "bold",
    color: "black",
    display: (inline === true) ? "inline-block" : "",
  };
  const cssTitle = {
    borderBottom: "solid 2px red",
    color: "red",
  };
  return (
    <div style={cssOuter}>
      {title && <div style={cssTitle}>{title}</div>}
      {error.message || error}
    </div>
  );
}
