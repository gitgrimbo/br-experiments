import React from "react";

export default function ClickableFieldset({
  legend,
  extraLegend,
  extraLegendSpace = true,
  children,
  help,
}) {
  const [visible, setVisible] = React.useState(true);
  const [helpMode, setHelpMode] = React.useState(false);

  const onClick = (e) => {
    e.preventDefault();
    setVisible(!visible);
  };

  const onClickHelp = (e) => {
    e.preventDefault();
    setVisible(true);
    setHelpMode(!helpMode);
  };

  return (
    <fieldset>
      <legend>
        <a href="#" onClick={onClick}>{legend}</a>
        {extraLegend && (
          extraLegendSpace ? <>{" "}{extraLegend}</> : extraLegend
        )}
        {help && (
          <>
            {" "}
            <a href="#" onClick={onClickHelp} style={{ textDecoration: "none" }}>{"❓"}</a>
          </>
        )}
      </legend>
      <div>{visible && (helpMode ? help : children)}</div>
    </fieldset>
  );
}
