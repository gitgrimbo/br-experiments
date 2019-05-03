import React from "react";
import { withTheme } from "@material-ui/core";

export default withTheme()(function HR({ children }) {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
});
