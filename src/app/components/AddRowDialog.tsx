import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { RowData } from "./WordGrid";

interface AddRowDialogProps {
  open: boolean;
  row: RowData;
  onChange: (row: RowData) => void;
  onClose: () => void;
  onAdd: () => void;
}

export const AddRowDialog: React.FC<AddRowDialogProps> = ({
  open,
  row,
  onChange,
  onClose,
  onAdd,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Neue Zeile hinzufügen</DialogTitle>
    <DialogContent>
      <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
        <TextField
          label="Deutsch"
          value={row.deutsch}
          onChange={(e) => onChange({ ...row, deutsch: e.target.value })}
          size="small"
          sx={{ flex: "1 1 180px" }}
        />
        <TextField
          label="Infinitiv"
          value={row.infinitiv}
          onChange={(e) => onChange({ ...row, infinitiv: e.target.value })}
          size="small"
          sx={{ flex: "1 1 180px" }}
        />
        <TextField
          label="Ich"
          value={row.ich}
          onChange={(e) => onChange({ ...row, ich: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Du (Männlich)"
          value={row.duM}
          onChange={(e) => onChange({ ...row, duM: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Du (Weiblich)"
          value={row.duW}
          onChange={(e) => onChange({ ...row, duW: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Er"
          value={row.er}
          onChange={(e) => onChange({ ...row, er: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Sie"
          value={row.sie}
          onChange={(e) => onChange({ ...row, sie: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Wir"
          value={row.wir}
          onChange={(e) => onChange({ ...row, wir: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Ihr"
          value={row.ihr}
          onChange={(e) => onChange({ ...row, ihr: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <TextField
          label="Sie (Plural)"
          value={row.siePlr}
          onChange={(e) => onChange({ ...row, siePlr: e.target.value })}
          size="small"
          sx={{ flex: "1 1 120px" }}
        />
        <Box>
          <input
            accept="audio/*"
            type="file"
            onChange={(e) =>
              onChange({
                ...row,
                audio:
                  e.target.files && e.target.files[0]
                    ? e.target.files[0]
                    : null,
              })
            }
            style={{ display: "none" }}
            id="audio-upload-dialog"
          />
          <label htmlFor="audio-upload-dialog">
            <Button component="span" startIcon={<UploadFile />} size="small">
              Audio hochladen
            </Button>
          </label>
          {row.audio && (
            <audio
              controls
              src={URL.createObjectURL(row.audio)}
              style={{ height: 24, marginLeft: 8 }}
            />
          )}
        </Box>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Abbrechen</Button>
      <Button onClick={onAdd} variant="contained">
        Hinzufügen
      </Button>
    </DialogActions>
  </Dialog>
);
