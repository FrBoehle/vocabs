"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CssBaseline,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import { ProjectNavbar } from "./components/ProjectNavbar";
import { WordGrid, RowData } from "./components/WordGrid";
import { AddRowDialog } from "./components/dialogs/AddRowDialog";
import { EditRowDialog } from "./components/dialogs/EditRowDialog";
import { DeleteConfirmDialog } from "./components/dialogs/DeleteConfirmDialog";
import { captions } from "./resources/captions.res";
import { Login } from "./components/Login";
import { messages } from "./resources/messages.res";

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
  const [rows, setRows] = useState<RowData[]>([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [projectName] = useState("Sprache: Assyrisch");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState<RowData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<RowData | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetch("/api/login")
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => setIsLoggedIn(data.loggedIn));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/words")
        .then((res) => {
          console.log("Response status:", res);
          return res.json();
        })
        .then((data) => {
          console.log("Fetched rows:", data);
          setRows(data);
        });
    }
  }, [isLoggedIn]);

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

  const handleAddRowConfirm = async (row: RowData) => {
    setRows((rows) => [
      ...rows,
      { ...row, id: rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1 },
    ]);
    setAddDialogOpen(false);

    await fetch("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
  };

  if (isLoggedIn === undefined) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body1">{captions.loadingDescription}</Typography>
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  if (rows.length === 0) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body1">{captions.loadingDescription}</Typography>
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

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
              {captions.verbs}
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
              onSave={async (updatedRow: RowData) => {
                setRows((rows) =>
                  rows.map((r) => (r.id === updatedRow.id ? updatedRow : r))
                );
                setEditDialogOpen(false);
                setEditRow(null);

                await fetch("/api/words", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedRow),
                });
              }}
            />
            <DeleteConfirmDialog
              open={deleteDialogOpen}
              message={messages.deleteConfirm}
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
