package com.example.demo.controllers;

import com.example.demo.model.TaskDTORequest;
import com.example.demo.model.TaskDTOResponse;
import com.example.demo.services.TaskService;
import com.example.demo.model.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  // <-- הוספת הלוגר
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDTOResponse> addTask(@Validated @RequestBody TaskDTORequest taskDTORequest) {
        logger.info("Received request to add task: {}", taskDTORequest);
        Task added = taskService.addTask(taskDTORequest);
        logger.info("Task added successfully: {}", added);
        TaskDTOResponse taskDTO = new TaskDTOResponse(added);
        return ResponseEntity.ok(taskDTO);
    }

    @GetMapping
    public ResponseEntity<List<TaskDTOResponse>> getAllTasks() {
        logger.info("Received request to get all tasks");
        List<Task> tasks = taskService.getAllTasks();
        logger.info("Returning {} tasks", tasks.size());
        List<TaskDTOResponse> taskDTOS = tasks.stream()
                .map(TaskDTOResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTOResponse> findTaskById(@PathVariable Long id) {
        logger.info("Received request to find task by id: {}", id);
        Optional<Task> task = taskService.findTaskById(id);
        if (task.isPresent()) {
            logger.info("Task found: {}", task.get());
            TaskDTOResponse taskDTO = new TaskDTOResponse(task.get());
            return ResponseEntity.ok(taskDTO);
        } else {
            logger.warn("Task with id {} not found", id);
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskDTOResponse>> getCompletedTasks() {
        logger.info("Received request to get complete tasks");
        List<Task> tasks = taskService.getCompleteTasks();
        if (tasks.isEmpty()) {
            logger.info("No complete tasks found");
            return ResponseEntity.ok(Collections.emptyList());
        }
        logger.info("Returning {} complete tasks", tasks.size());
        List<TaskDTOResponse> taskDTOS = tasks.stream()
                .map(TaskDTOResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(taskDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskDTOResponse>> searchTasks(@RequestParam String keyword) {
        logger.info("Received request to search tasks with keyword: {}", keyword);
        List<Task> tasks = taskService.searchTasksByKeyword(keyword);
        if (tasks.isEmpty()) {
            logger.info("No tasks found");
            return ResponseEntity.ok(Collections.emptyList());
        } else {
            logger.info("Returning {} tasks", tasks.size());
            List<TaskDTOResponse> taskDTOS = tasks.stream()
                    .map(TaskDTOResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(taskDTOS);
        }
    }

    @PutMapping("/{id}/toggle-completed")
    public ResponseEntity<TaskDTOResponse> updateTaskStatus(@PathVariable Long id) {
        logger.info("Received request to update status of task with id: {}", id);
        Optional<Task> updatedTask = taskService.changeTaskStatus(id);
        if (updatedTask.isPresent()) {
            logger.info("Task status updated: {}", updatedTask.get());
            TaskDTOResponse taskDTO = new TaskDTOResponse(updatedTask.get());
            return ResponseEntity.ok(taskDTO);
        } else {
            logger.warn("Task with id {} not found for status update", id);
            return ResponseEntity.status(404).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateTask(
            @PathVariable Long id,
            @Validated @RequestBody TaskDTORequest taskDTORequest) {
        logger.info("Received request to update task with id {}: {}", id, taskDTORequest);
        Optional<Task> existingTask = taskService.findTaskById(id);
        if (existingTask.isEmpty()) {
            logger.warn("Task with id {} not found for update", id);
            return ResponseEntity.status(404).build();
        }
        Task updatedTask = new Task(taskDTORequest.getName(), taskDTORequest.getDescription());
        updatedTask.setId(id);
        updatedTask.setCompleted(existingTask.get().isCompleted());
        taskService.updateTask(id, updatedTask);
        logger.info("Task with id {} updated successfully", id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        logger.info("Received request to delete task with id: {}", id);
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            logger.info("Task with id {} deleted successfully", id);
            return ResponseEntity.ok().build();
        } else {
            logger.warn("Task with id {} not found for deletion", id);
            return ResponseEntity.status(404).build();
        }
    }
}
