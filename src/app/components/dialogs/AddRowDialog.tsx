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
      <WordFormFields row={row} onChange={onChange} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Abbrechen</Button>
      <Button onClick={onAdd} variant="contained">
        Hinzufügen
      </Button>
    </DialogActions>
  </Dialog>
);
