import { Edit, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
    { field: 'deutsch', headerName: 'Deutsch', flex: 1, minWidth: 100 },
    { field: 'infinitiv', headerName: 'Infinitiv', flex: 1, minWidth: 100 },
    { field: 'ich', headerName: 'Ich', flex: 1, minWidth: 80 },
    { field: 'du', headerName: 'Du (M)', flex: 1, minWidth: 80 },
    { field: 'er', headerName: 'Er', flex: 1, minWidth: 80 },
    { field: 'wir', headerName: 'Wir', flex: 1, minWidth: 80 },
    { field: 'ihrM', headerName: 'Ihr (M)', flex: 1, minWidth: 80 },
    { field: 'ihrW', headerName: 'Ihr (W)', flex: 1, minWidth: 80 },
    { field: 'sie', headerName: 'Sie', flex: 1, minWidth: 80 },
    {
      field: 'audio',
      headerName: 'Audiosample',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <audio controls src={URL.createObjectURL(params.value)} style={{ height: 24 }} />
        ) : null,
      sortable: false,
      filterable: false,
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton size="small" onClick={() => {/* open Edit-Dialog */}}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteRow(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];

function handleDeleteRow(id: any): void {
    throw new Error("Function not implemented.");
}
