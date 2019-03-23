import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AsyncButton({
  children,
  onClick,
  ...rest
}) {
  const [processing, setProcessing] = React.useState(false);

  const _onClick = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (onClick) {
        await onClick(e);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={_onClick}
      disabled={processing}
      {...rest}
    >
      {children}
      {processing && (
        <CircularProgress size={18} style={{ marginLeft: "1em" }} />
      )}
    </Button>
  );
}
