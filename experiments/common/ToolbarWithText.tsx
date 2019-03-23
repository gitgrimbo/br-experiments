import * as React from "react";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

interface ToolbarWithTextProps {
  title: string;
  text: string;
}

export const ToolbarWithText: React.FC<ToolbarWithTextProps> = ({
  title,
  text,
}: ToolbarWithTextProps) => (
    // Use flexGrow to push the text to the right-hand side
    <Toolbar>
      <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>{title}</Typography>
      <Typography variant="body2" color="inherit" align="right">{text}</Typography>
    </Toolbar>
  );

interface ToolbarWithVersionProps {
  title: string;
  gitShort: string;
  gitDate: string;
}

export const ToolbarWithVersion: React.FC<ToolbarWithVersionProps> = ({
  title,
  gitShort,
  gitDate,
}: ToolbarWithVersionProps) => {
  // E.g. turn "2020-02-27T14:56:34.000Z" into "2020-02-27"
  const dateStr = gitDate.replace(/T.*/, "");
  return (
    <ToolbarWithText title={title} text={`${gitShort} ${dateStr}`} />
  );
};
