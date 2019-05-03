import React from "react";
import { withTheme } from "@material-ui/core";

export default withTheme()(function HR({ theme }) {
  const { primary } = theme.palette;
  return <hr
    style={{
      border: `solid 1px ${primary.main}`,
      opacity: 0.5,
      marginTop: "1em",
      marginBottom: "1em",
      width: "100%",
    }}
  />;
});
