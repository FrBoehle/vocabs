"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { ProjectNavbar } from "./components/ProjectNavbar";
import { WordGrid, RowData } from "./components/WordGrid";
import { exampleData } from "./data/initialsRows";
import { AddRowDialog } from "./components/dialogs/AddRowDialog";
import { EditRowDialog } from "./components/dialogs/EditRowDialog";
import { DeleteConfirmDialog } from "./components/dialogs/DeleteConfirmDialog";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<RowData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<RowData | null>(null);

  const handleAudioUpload = (id: number, file: File | null) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, audio: file } : row)));
  };

  const handleDeleteClick = (row: RowData) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete) {
      setRows((rows) => rows.filter((r) => r.id !== rowToDelete.id));
      setRowToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setRowToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleEditRow = (row: RowData) => {
    setEditRow(row);
    setEditDialogOpen(true);
  };

  const handleAddRow = () => setAddDialogOpen(true);

  const handleAddRowConfirm = (row: RowData) => {
    setRows((rows) => [
      ...rows,
      { ...row, id: rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1 },
    ]);
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
              onDelete={handleDeleteClick}
              onAudioUpload={handleAudioUpload}
              onEdit={handleEditRow}
              onAdd={handleAddRow}
            />
            <AddRowDialog
              open={addDialogOpen}
              defaultRow={defaultRow}
              onClose={() => setAddDialogOpen(false)}
              onAdd={handleAddRowConfirm}
            />
            <EditRowDialog
              open={editDialogOpen}
              row={editRow}
              onClose={() => setEditDialogOpen(false)}
              onSave={(updatedRow: RowData) => {
                setRows((rows) =>
                  rows.map((r) => (r.id === updatedRow.id ? updatedRow : r))
                );
                setEditDialogOpen(false);
                setEditRow(null);
              }}
            />
            <DeleteConfirmDialog
              open={deleteDialogOpen}
              message="Möchtest du diese Zeile wirklich löschen?"
              onCancel={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
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
