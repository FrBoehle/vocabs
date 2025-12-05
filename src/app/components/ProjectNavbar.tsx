import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  BottomNavigation,
  BottomNavigationAction,
  Theme,
} from "@mui/material";
import { captions } from "../resources/captions.res";
import { Book, LibraryBooks, EmojiObjects, Chat } from "@mui/icons-material";

interface ProjectNavbarProps {
  projectName: string;
  tabIndex: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  theme: Theme;
  isMobile: boolean;
}

export const ProjectNavbar: React.FC<ProjectNavbarProps> = ({
  projectName,
  tabIndex,
  onTabChange,
  theme,
  isMobile,
}) => {
  if (isMobile) {
    return (
      <BottomNavigation
        value={tabIndex}
        onChange={onTabChange}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
        }}
      >
        <BottomNavigationAction label="Verben" icon={<LibraryBooks />} />
        <BottomNavigationAction label="Nomen" icon={<LibraryBooks />} />
        <BottomNavigationAction label="Adjektive" icon={<LibraryBooks />} />
        <BottomNavigationAction label="Phrasen" icon={<Chat />} />
      </BottomNavigation>
    );
  }

  return (
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
};
