import React from "react";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default ({ html }) => (
  <div style={{ paddingBottom: "1em" }}>
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Help</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography dangerouslySetInnerHTML={{ __html: html }}></Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);
