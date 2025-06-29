import React, { useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList.tsx";
import AddTodo from "./components/AddTodo.tsx";
import { Todo } from "./models/Todo";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const App: React.FC = () => {

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: 40,
        background: "#f5f7fa",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 32,
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        color="primary"
        style={{ fontWeight: 700, letterSpacing: 1 }}
      >
        Task Manager
      </Typography>

      <TodoList/>
    </Container>
  );
};

export default App;
