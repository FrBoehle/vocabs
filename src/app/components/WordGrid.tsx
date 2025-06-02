import React, { ChangeEvent } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UploadFile, Delete, Edit } from "@mui/icons-material";

export interface RowData {
  id: number;
  deutsch: string;
  infinitiv: string;
  ich: string;
  duM: string;
  duW: string;
  er: string;
  sie: string;
  wir: string;
  ihr: string;
  siePlr: string;
  audio: File | null;
}

interface WordGridProps {
  rows: RowData[];
  onDelete: (id: number) => void;
  onAudioUpload: (id: number, file: File | null) => void;
  onEdit: (row: RowData) => void;
  onAdd: () => void;
}

export const WordGrid: React.FC<WordGridProps> = ({
  rows,
  onDelete,
  onAudioUpload,
  onEdit,
  onAdd,
}) => {
  const columns: GridColDef[] = [
    { field: "deutsch", headerName: "Deutsch", flex: 1, minWidth: 100 },
    { field: "infinitiv", headerName: "Infinitiv", flex: 1, minWidth: 100 },
    { field: "ich", headerName: "Ich", flex: 1, minWidth: 80 },
    { field: "duM", headerName: "Du (M)", flex: 1, minWidth: 80 },
    { field: "duW", headerName: "Du (W)", flex: 1, minWidth: 80 },
    { field: "er", headerName: "Er", flex: 1, minWidth: 80 },
    { field: "sie", headerName: "Sie", flex: 1, minWidth: 80 },
    { field: "wir", headerName: "Wir", flex: 1, minWidth: 80 },
    { field: "ihr", headerName: "Ihr", flex: 1, minWidth: 80 },
    { field: "siePlr", headerName: "Sie (Plural)", flex: 1, minWidth: 80 },
    {
      field: "audio",
      headerName: "Audiosample",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<RowData>) =>
        params.row.audio ? (
          <Box display="flex" alignItems="center" gap={1}>
            <input
              accept="audio/*"
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onAudioUpload(
                  params.row.id,
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
              style={{ display: "none" }}
              id={`audio-upload-${params.row.id}`}
            />
            <label htmlFor={`audio-upload-${params.row.id}`}>
              <IconButton component="span">
                <UploadFile />
              </IconButton>
            </label>
            {params.row.audio && (
              <audio controls src={URL.createObjectURL(params.row.audio)} />
            )}
          </Box>
        ) : (
          <Box>
            <input
              accept="audio/*"
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onAudioUpload(
                  params.row.id,
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
              style={{ display: "none" }}
              id={`audio-upload-${params.row.id}`}
            />
            <label htmlFor={`audio-upload-${params.row.id}`}>
              <IconButton component="span">
                <UploadFile />
              </IconButton>
            </label>
          </Box>
        ),
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      headerName: "Aktionen",
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            size="small"
            onClick={() => onEdit(params.row as RowData)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: 400 }}>
        <DataGrid rows={rows} columns={columns} showToolbar />
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={onAdd}
      >
        + Neues Wort hinzufügen
      </Button>
    </Box>
  );
};
