import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { captions } from "../resources/captions.res";

interface ProjectNavbarProps {
  projectName: string;
  tabIndex: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const ProjectNavbar: React.FC<ProjectNavbarProps> = ({
  projectName,
  tabIndex,
  onTabChange,
}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {projectName}
      </Typography>
    </Toolbar>
    <Tabs
      value={tabIndex}
      onChange={onTabChange}
      centered
      indicatorColor="secondary"
      textColor="inherit"
    >
      <Tab label={captions.verbs} />
      <Tab label={captions.nouns} />
      <Tab label={captions.adjectives} />
      <Tab label={captions.phrases} />
    </Tabs>
  </AppBar>
);
