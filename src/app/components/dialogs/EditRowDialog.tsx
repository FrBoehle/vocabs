import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { RowData } from "../WordGrid";
import { FormFields } from "./FormFields";

interface EditRowDialogProps {
  open: boolean;
  row: RowData | null;
  onClose: () => void;
  onSave: (row: RowData) => void;
}

export const EditRowDialog: React.FC<EditRowDialogProps> = ({
  open,
  row,
  onClose,
  onSave,
}) => {
  const [localRow, setLocalRow] = useState<RowData | null>(row);

  useEffect(() => {
    if (open && row) setLocalRow(row);
    if (!open) setLocalRow(null);
  }, [open, row]);

  const handleFieldChange = (changed: Partial<RowData>) => {
    setLocalRow((prev) => (prev ? { ...prev, ...changed } : prev));
  };

  const handleSave = () => {
    if (localRow) {
      onSave(localRow);
    }
  };

  if (!localRow) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Zeile bearbeiten</DialogTitle>
      <DialogContent>
        <FormFields row={localRow} onChange={handleFieldChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleSave} variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};