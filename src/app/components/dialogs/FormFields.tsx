import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { RowData } from "../WordGrid";
import { captions } from "@/app/resources/captions.res";

interface FormFieldsProps {
  row: RowData;
  onChange: (changed: Partial<RowData>) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({ row, onChange }) => (
  <Box display="flex" flexDirection="column" gap={2} mt={1}>
    {/* Zeile 1 */}
    <Box display="flex" gap={2}>
      <TextField
        label={captions.deutsch}
        value={row.deutsch}
        onChange={(e) => onChange({ deutsch: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label="Infinitiv"
        value={row.infinitiv}
        onChange={(e) => onChange({ infinitiv: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
    {/* Zeile 2 */}
    <Box display="flex" gap={2}>
      <TextField
        label={captions.ich}
        value={row.ich}
        onChange={(e) => onChange({ ich: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.duM}
        value={row.duM}
        onChange={(e) => onChange({ duM: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.duW}
        value={row.duW}
        onChange={(e) => onChange({ duW: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.er}
        value={row.er}
        onChange={(e) => onChange({ er: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.sie}
        value={row.sie}
        onChange={(e) => onChange({ sie: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
    {/* Zeile 3 */}
    <Box display="flex" gap={2}>
      <TextField
        label={captions.wir}
        value={row.wir}
        onChange={(e) => onChange({ wir: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.ihr}
        value={row.ihr}
        onChange={(e) => onChange({ ihr: e.target.value })}
        size="small"
        fullWidth
      />
      <TextField
        label={captions.siePlr}
        value={row.siePlr}
        onChange={(e) => onChange({ siePlr: e.target.value })}
        size="small"
        fullWidth
      />
      {/* Zeile 4 */}
      <Box display="flex" alignItems="center">
        <input
          accept="audio/*"
          type="file"
          onChange={(e) =>
            onChange({
              audio:
                e.target.files && e.target.files[0] ? e.target.files[0] : null,
            })
          }
          style={{ display: "none" }}
          id="audio-upload-dialog"
        />
        <label htmlFor="audio-upload-dialog">
          <Button component="span" startIcon={<UploadFile />} size="small">
            {captions.audioUpload}
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
