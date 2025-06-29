import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import EditIcon from "@mui/icons-material/Edit";

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  loading: boolean;
  expanded: boolean;
  editing: boolean;
  onExpand: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onStartEdit: (task: Task) => void;
  children?: React.ReactNode; // for edit form
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  loading,
  expanded,
  editing,
  onExpand,
  onDelete,
  onComplete,
  onStartEdit,
  children,
}) => {
  return (
    <Card
      style={{
        borderRadius: 14,
        marginBottom: 10,
        background: task.completed ? "#e3fcec" : "#f5f7fa",
        boxShadow: "0 2px 8px rgba(25,118,210,0.06)",
        transition: "background 0.3s",
        width: "100%",
      }}
    >
      <CardContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          {editing ? (
            children
          ) : (
            <span
              style={{
                fontWeight: "bold",
                fontSize: "clamp(1rem, 3vw, 1.2rem)",
                cursor: "pointer",
                textDecoration: "underline",
                color: "#1976d2",
              }}
              onClick={() => onExpand(task.id)}
            >
              {task.name}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginLeft: 12,
          }}
        >
          <IconButton
            onClick={() => onComplete(task.id)}
            color={task.completed ? "success" : "primary"}
            size="small"
            disabled={loading}
            title={
              task.completed ? "Mark as not completed" : "Mark as completed"
            }
          >
            {task.completed ? (
              <CheckCircleIcon fontSize="medium" style={{ color: "#43a047" }} />
            ) : (
              <RadioButtonUncheckedIcon
                fontSize="medium"
                style={{ color: "#90caf9" }}
              />
            )}
          </IconButton>
          <IconButton
            onClick={() => onDelete(task.id)}
            disabled={loading}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => onStartEdit(task)}
            disabled={loading}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </div>
      </CardContent>
      {expanded && !editing && (
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(25,118,210,0.08)",
            padding: 16,
            margin: "0 16px 16px 16px",
            fontSize: "clamp(0.95rem, 2.5vw, 1.08rem)",
          }}
        >
          <div>
            <b>Description:</b> {task.description}
          </div>
          <div>
            <b>ID:</b> {task.id}
          </div>
          <div>
            <b>Status:</b> {task.completed ? "Completed" : "To do"}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskItem;
