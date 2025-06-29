import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

interface TaskFormProps {
  title: string;
  name: string;
  description: string;
  loading: boolean;
  error?: string | null;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  name,
  description,
  loading,
  error,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}) => (
  <form
    onSubmit={onSubmit}
    style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}
  >
    <h3 style={{ margin: 0 }}>{title}</h3>
    {error && <Alert severity="error">{error}</Alert>}
    <TextField
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      size="small"
      variant="outlined"
      label="Title"
      required
      fullWidth
    />
    <TextField
      value={description}
      onChange={(e) => onDescriptionChange(e.target.value)}
      size="small"
      variant="outlined"
      label="Description"
      required
      fullWidth
      multiline
      minRows={2}
      maxRows={4}
    />
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        disabled={loading}
      >
        Save
      </Button>
      {onCancel && (
        <Button
          onClick={onCancel}
          variant="outlined"
          color="secondary"
          size="small"
          disabled={loading}
        >
          Cancel
        </Button>
      )}
    </div>
  </form>
);

export default TaskForm;
