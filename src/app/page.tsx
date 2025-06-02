"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { ProjectNavbar } from "./components/ProjectNavbar";
import { WordGrid, RowData } from "./components/WordGrid";
import { exampleData } from "./data/initialsRows";
import { AddRowDialog } from "./components/AddRowDialog";
import { EditRowDialog } from "./components/EditRowDialog";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const defaultRow: RowData = {
  id: 0,
  deutsch: "",
  infinitiv: "",
  ich: "",
  duM: "",
  duW: "",
  er: "",
  sie: "",
  wir: "",
  ihr: "",
  siePlr: "",
  audio: null,
};

function App() {
  const [rows, setRows] = useState<RowData[]>(exampleData);

  const [tabIndex, setTabIndex] = useState(0);
  const [projectName, setProjectName] = useState("Assyrisch lernen");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRow, setNewRow] = useState<RowData>(defaultRow);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<RowData | null>(null);

  const handleAudioUpload = (id: number, file: File | null) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, audio: file } : row)));
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleEditRow = (row: RowData) => {
    setEditRow(row);
    setEditDialogOpen(true);
  };

  const handleEditRowConfirm = () => {
    if (editRow) {
      setRows(rows.map((r) => (r.id === editRow.id ? editRow : r)));
      setEditDialogOpen(false);
      setEditRow(null);
    }
  };

  const handleAddRow = () => setAddDialogOpen(true);

  const handleAddRowConfirm = () => {
    setRows([
      ...rows,
      {
        ...newRow,
        id: rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
      },
    ]);
    setNewRow(defaultRow);
    setAddDialogOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ProjectNavbar
        projectName={projectName}
        tabIndex={tabIndex}
        onTabChange={(_, newValue) => setTabIndex(newValue)}
      />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {tabIndex === 0 && (
          <>
            <Typography variant="h4" gutterBottom>
              Verben
            </Typography>

            <WordGrid
              rows={rows}
              onDelete={handleDeleteRow}
              onAudioUpload={handleAudioUpload}
              onEdit={handleEditRow}
              onAdd={handleAddRow}
            />
            <AddRowDialog
              open={addDialogOpen}
              row={newRow}
              onChange={setNewRow}
              onClose={() => setAddDialogOpen(false)}
              onAdd={handleAddRowConfirm}
            />
            <EditRowDialog
              open={editDialogOpen}
              row={editRow}
              onChange={(row) => setEditRow(row)}
              onClose={() => setEditDialogOpen(false)}
              onSave={handleEditRowConfirm}
            />
          </>
        )}
        {tabIndex === 1 && (
          <Typography variant="h4" gutterBottom>
            Nomen (Inhalt folgt)
          </Typography>
        )}
        {tabIndex === 2 && (
          <Typography variant="h4" gutterBottom>
            Adjektive (Inhalt folgt)
          </Typography>
        )}
        {tabIndex === 3 && (
          <Typography variant="h4" gutterBottom>
            Phrasen (Inhalt folgt)
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
