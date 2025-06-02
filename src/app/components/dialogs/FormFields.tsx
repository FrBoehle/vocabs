import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { RowData } from "../WordGrid";

interface WordFormFieldsProps {
  row: RowData;
  onChange: (row: RowData) => void;
}

export const WordFormFields: React.FC<WordFormFieldsProps> = ({
  row,
  onChange,
}) => (
  <Box display="flex" flexDirection="column" gap={2} mt={1}>
    {/* Zeile 1 */}
    <Box display="flex" gap={2}>
      <TextField
        label="Deutsch"
        value={row.deutsch}
        onChange={(e) => onChange({ ...row, deutsch: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Infinitiv"
        value={row.infinitiv}
        onChange={(e) => onChange({ ...row, infinitiv: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
    {/* Zeile 2 */}
    <Box display="flex" gap={2}>
      <TextField
        label="Ich"
        value={row.ich}
        onChange={(e) => onChange({ ...row, ich: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Du (Männlich)"
        value={row.duM}
        onChange={(e) => onChange({ ...row, duM: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Du (Weiblich)"
        value={row.duW}
        onChange={(e) => onChange({ ...row, duW: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Er"
        value={row.er}
        onChange={(e) => onChange({ ...row, er: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Sie"
        value={row.sie}
        onChange={(e) => onChange({ ...row, sie: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
    {/* Zeile 3 */}
    <Box display="flex" gap={2}>
      <TextField
        label="Wir"
        value={row.wir}
        onChange={(e) => onChange({ ...row, wir: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Ihr"
        value={row.ihr}
        onChange={(e) => onChange({ ...row, ihr: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Sie (Plural)"
        value={row.siePlr}
        onChange={(e) => onChange({ ...row, siePlr: e.target.value })}
        size="small"
        fullWidth
      />
      <Box display="flex" alignItems="center">
        <input
          accept="audio/*"
          type="file"
          onChange={(e) =>
            onChange({
              ...row,
              audio:
                e.target.files && e.target.files[0] ? e.target.files[0] : null,
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
  </Box>
);
