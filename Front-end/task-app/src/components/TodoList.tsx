import React, { useEffect, useState } from "react";
import "./TodoList.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import EditIcon from "@mui/icons-material/Edit";

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface TaskInput {
  name: string;
  description: string;
  completed?: boolean;
}

const API_URL = "/tasks";

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<TaskInput>({
    name: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [foundTask, setFoundTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.description.trim()) return;
    setLoading(true);
    setError(null);
    setErrorForm(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) {
        let msg = "Unknown error";
        try {
          const errorData = await res.json();
          if (errorData.name) msg = errorData.name;
        } catch {}
        setErrorForm(msg);
        setLoading(false);
        return;
      }
      setNewTask({ name: "", description: "" });
      setShowForm(false);
      await fetchTasks();
    } catch (err: any) {
      setErrorForm("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}/toggle-completed`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to complete task");
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async (e: React.FormEvent) => {
    e.preventDefault();
    setFoundTask(null);
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${searchId}`);
      if (!res.ok) throw new Error("Task not found");
      const data = await res.json();
      setFoundTask(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandTask = (id: number) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.name);
    setEditDescription(task.description);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleSaveEdit = async (task: Task) => {
    setLoading(true);
    setError(null);
    setEditError(null);
    try {
      const res = await fetch(`/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          name: editTitle,
          description: editDescription,
        }),
      });
      if (!res.ok) {
        let msg = "Unknown error";
        try {
          const errorData = await res.json();
          if (errorData.name) msg = errorData.name;
        } catch {}
        setEditError(msg);
        setLoading(false);
        return;
      }
      setEditingTaskId(null);
      setEditTitle("");
      setEditDescription("");
      await fetchTasks();
    } catch (err: any) {
      setEditError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: 600,
        background: "linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)",
        borderRadius: 24,
        boxShadow: "0 4px 32px rgba(25,118,210,0.10)",
        padding: "32px 8px",
        maxWidth: 600,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1976d2",
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: 1,
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
        }}
      >
        Task List
      </h2>
      <TextField
        label="Search by keyword"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
        style={{ marginBottom: 16 }}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={showCompletedOnly}
            onChange={() => setShowCompletedOnly(!showCompletedOnly)}
            color="primary"
          />
        }
        label="Show Completed Only"
        style={{ display: "block", textAlign: "center", marginBottom: 16 }}
      />
      <Zoom in={!showForm}>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "absolute", top: 24, right: 24, zIndex: 2 }}
          onClick={() => setShowForm(true)}
        >
          <AddIcon />
        </Fab>
      </Zoom>
      <Zoom in={showForm} unmountOnExit>
        <form
          onSubmit={handleAddTask}
          className="todo-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 18,
            background: "#fff",
            borderRadius: 16,
            padding: "24px 12px",
            boxShadow: "0 2px 16px rgba(25,118,210,0.08)",
            maxWidth: 500,
            margin: "0 auto",
            position: "relative",
            width: "100%",
          }}
        >
          {errorForm && <Alert severity="error">{errorForm}</Alert>}
          <Button
            onClick={() => setShowForm(false)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: 0,
              padding: 4,
              color: "#1976d2",
            }}
          >
            X
          </Button>
          <TextField
            label="Title"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            variant="filled"
            size="medium"
            fullWidth
            required
            InputProps={{ style: { borderRadius: 8, background: "#f5f7fa" } }}
          />
          <TextField
            label="Description"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            variant="filled"
            size="medium"
            fullWidth
            required
            multiline
            minRows={3}
            maxRows={6}
            InputProps={{
              style: {
                borderRadius: 8,
                background: "#f5f7fa",
                minHeight: 80,
                fontSize: 16,
              },
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              style={{
                minWidth: 120,
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
                padding: "10px 0",
              }}
            >
              Add Task
            </Button>
          </div>
        </form>
      </Zoom>
      <form
        onSubmit={handleSearchById}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          margin: "0 auto 18px auto",
          maxWidth: 400,
        }}
      >
        <TextField
          label="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
            style: { borderRadius: 8, background: "#fff" },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          Search
        </Button>
      </form>
      {foundTask && (
        <Card
          style={{
            borderRadius: 14,
            marginBottom: 10,
            background: foundTask.completed ? "#e3fcec" : "#f5f7fa",
            boxShadow: "0 2px 8px rgba(25,118,210,0.06)",
            transition: "background 0.3s",
            width: "100%",
            maxWidth: 500,
            margin: "0 auto",
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                }}
              >
                {foundTask.name}
              </span>
              <span style={{ marginLeft: 10 }}>{foundTask.description}</span>
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
              {foundTask.completed ? (
                <CheckCircleIcon
                  fontSize="medium"
                  style={{ color: "#43a047" }}
                  titleAccess="Completed"
                />
              ) : (
                <RadioButtonUncheckedIcon
                  fontSize="medium"
                  style={{ color: "#90caf9" }}
                  titleAccess="To do"
                />
              )}
              <IconButton
                onClick={() => handleCompleteTask(foundTask.id)}
                disabled={foundTask.completed || loading}
                color="success"
                size="small"
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteTask(foundTask.id)}
                disabled={loading}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      )}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: 10 }}>
          <CircularProgress />
        </div>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && tasks.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: 32,
            fontSize: 18,
          }}
        >
          No tasks to display. Add a new task to get started!
        </div>
      )}
      <List className="todo-list" style={{ marginTop: 8 }}>
        {tasks
          .filter((task) => (showCompletedOnly ? task.completed : true))
          .filter(
            (task) =>
              (task.name &&
                task.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (task.description &&
                task.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
          .map((task) => (
            <Zoom in key={task.id}>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    {editingTaskId === task.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveEdit(task);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {editError && (
                          <Alert severity="error">{editError}</Alert>
                        )}
                        <TextField
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          size="small"
                          variant="outlined"
                          label="Title"
                          required
                          fullWidth
                        />
                        <TextField
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
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
                          <Button
                            onClick={handleCancelEdit}
                            variant="outlined"
                            color="secondary"
                            size="small"
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "clamp(1rem, 3vw, 1.2rem)",
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "#1976d2",
                        }}
                        onClick={() => handleExpandTask(task.id)}
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
                      onClick={() => handleCompleteTask(task.id)}
                      color={task.completed ? "success" : "primary"}
                      size="small"
                      disabled={loading}
                      title={
                        task.completed
                          ? "Mark as not completed"
                          : "Mark as completed"
                      }
                    >
                      {task.completed ? (
                        <CheckCircleIcon
                          fontSize="medium"
                          style={{ color: "#43a047" }}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          fontSize="medium"
                          style={{ color: "#90caf9" }}
                        />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={loading}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleStartEdit(task)}
                      disabled={loading}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                </CardContent>
                {expandedTaskId === task.id && editingTaskId !== task.id && (
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
            </Zoom>
          ))}
      </List>
    </div>
  );
};
export default TodoList;
