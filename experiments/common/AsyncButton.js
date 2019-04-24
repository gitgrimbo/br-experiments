import React from "react";

export default function AsyncButton({
  children,
  onClick,
  processingMessage = "Processing...",
  ...rest
}) {
  const [processing, setProcessing] = React.useState(false);
  return (
    <button
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
    >{processing ? processingMessage : children}</button>
  );
}
