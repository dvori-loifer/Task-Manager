package com.example.demo.services;

import com.example.demo.model.TaskDTORequest;
import com.example.demo.repositories.TaskRepository;
import com.example.demo.model.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;  // <-- הוספת הלוגר
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task addTask(TaskDTORequest taskDTORequest) {
        Task task = new Task(taskDTORequest.getName(), taskDTORequest.getDescription());
        logger.info("Adding task: {}", taskDTORequest);
        Task addedTask = repository.addTask(task);
        logger.info("Task added: {}", addedTask);
        return addedTask;
    }

    public List<Task> getAllTasks() {
        logger.info("Fetching all tasks");
        List<Task> tasks = repository.getAllTasks();
        logger.info("Fetched {} tasks", tasks.size());
        return tasks;
    }

    public Optional<Task> findTaskById(Long id) {
        logger.info("Searching for task by id: {}", id);
        Optional<Task> task = repository.findTaskById(id);
        if (task.isPresent()) {
            logger.info("Task found: {}", task.get());
        } else {
            logger.warn("Task with id {} not found", id);
        }
        return task;
    }

    public List<Task> getCompleteTasks() {
        logger.info("Fetching complete tasks");
        List<Task> tasks = repository.getCompleteTasks();
        logger.info("Found {} complete tasks", tasks.size());
        return tasks;
    }

    public List<Task> searchTasksByKeyword(String keyword) {
        logger.info("Searching tasks with keyword: {}", keyword);
        List<Task> tasks = repository.searchTasksByKeyword(keyword);
        logger.info("Found {} tasks matching keyword '{}'", tasks.size(), keyword);
        return tasks;
    }

    public Optional<Task> changeTaskStatus(Long id) {
        logger.info("Changing status of task with id: {}", id);
        Optional<Task> updatedTask = repository.changeTaskStatus(id);
        if (updatedTask.isPresent()) {
            logger.info("Task status changed: {}", updatedTask.get());
        } else {
            logger.warn("Task with id {} not found for status change", id);
        }
        return updatedTask;
    }

    public void updateTask(Long id, Task task) {
        logger.info("Updating task: {}", task);
        repository.updateTask(id, task);
        logger.info("Task updated successfully");
    }

    public boolean deleteTask(Long id) {
        logger.info("Deleting task with id: {}", id);
        boolean deleted = repository.deleteTask(id);
        if (deleted) {
            logger.info("Task with id {} deleted", id);
        } else {
            logger.warn("Task with id {} not found for deletion", id);
        }
        return deleted;
    }
}
