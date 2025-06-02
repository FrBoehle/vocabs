import React, { ChangeEvent } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UploadFile, Delete, Edit } from "@mui/icons-material";
import { captions } from "../resources/captions.res";

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
  onDelete: (row: RowData) => void;
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
    { field: "deutsch", headerName: captions.deutsch, flex: 1, minWidth: 100 },
    {
      field: "infinitiv",
      headerName: captions.infinitiv,
      flex: 1,
      minWidth: 100,
    },
    { field: "ich", headerName: captions.ich, flex: 1, minWidth: 80 },
    { field: "duM", headerName: captions.duM, flex: 1, minWidth: 80 },
    { field: "duW", headerName: captions.duW, flex: 1, minWidth: 80 },
    { field: "er", headerName: captions.er, flex: 1, minWidth: 80 },
    { field: "sie", headerName: captions.sie, flex: 1, minWidth: 80 },
    { field: "wir", headerName: captions.wir, flex: 1, minWidth: 80 },
    { field: "ihr", headerName: captions.ihr, flex: 1, minWidth: 80 },
    { field: "siePlr", headerName: captions.siePlr, flex: 1, minWidth: 80 },
    {
      field: "audio",
      headerName: captions.audioSample,
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
      headerName: captions.actions,
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
          <IconButton
            size="small"
            onClick={() => onDelete(params.row as RowData)}
          >
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
        {captions.addWord}
      </Button>
    </Box>
  );
};
