import React from "react";
import Button from "@material-ui/core/Button";

export default function AsyncButton({
  children,
  onClick,
  processingMessage = "Processing...",
  ...rest
}) {
  const [processing, setProcessing] = React.useState(false);
  return (
    <Button
      variant="contained"
      onClick={async (e) => {
        e.preventDefault();
        try {
          setProcessing(true);
          if (onClick) {
            await onClick(e);
          }
        } finally {
          setProcessing(false);
        }
      }}
      disabled={processing}
      {...rest}
    >{processing ? processingMessage : children}</Button>
  );
}
