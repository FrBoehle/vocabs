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

interface AddRowDialogProps {
  open: boolean;
  defaultRow: RowData;
  onClose: () => void;
  onAdd: (row: RowData) => void;
}

export const AddRowDialog: React.FC<AddRowDialogProps> = ({
  open,
  defaultRow,
  onClose,
  onAdd,
}) => {
  const [localRow, setLocalRow] = useState<RowData>(defaultRow);

  useEffect(() => {
    if (open) setLocalRow(defaultRow);
  }, [open, defaultRow]);

  const handleFieldChange = (changed: Partial<RowData>) => {
    setLocalRow((prev) => ({ ...prev, ...changed }));
  };

  const handleAdd = () => {
    onAdd(localRow);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Neue Zeile hinzufügen</DialogTitle>
      <DialogContent>
        <FormFields row={localRow} onChange={handleFieldChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleAdd} variant="contained">
          Hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
};