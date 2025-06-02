import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { messages } from "@/app/resources/messages.res";

interface DeleteConfirmDialogProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  message,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{messages.confirmDeleteTitle}</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>{messages.cancel}</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        {messages.delete}
      </Button>
    </DialogActions>
  </Dialog>
);
