import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { RowData } from "../WordGrid";
import { WordFormFields } from "./FormFields";

interface EditRowDialogProps {
  open: boolean;
  row: RowData | null;
  onChange: (row: RowData) => void;
  onClose: () => void;
  onSave: () => void;
}

export const EditRowDialog: React.FC<EditRowDialogProps> = ({
  open,
  row,
  onChange,
  onClose,
  onSave,
}) => {
  if (!row) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Zeile bearbeiten</DialogTitle>
      <DialogContent>
        <WordFormFields row={row} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={onSave} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};
