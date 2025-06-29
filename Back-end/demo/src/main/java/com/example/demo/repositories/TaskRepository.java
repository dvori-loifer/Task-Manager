package com.example.demo.repositories;

import com.example.demo.model.Task;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class TaskRepository {

    private final Map<Long, Task> tasks = new HashMap<>();
    private long currentId = 1;

    public Task addTask(Task task) {
        task.setId(currentId);
        tasks.put(currentId++, task);
        return task;
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks.values());
    }

    public Optional<Task> findTaskById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public List<Task> getCompleteTasks() {
        return tasks.values().stream()
                .filter(Task::isCompleted)
                .collect(Collectors.toList());
    }

    public List<Task> searchTasksByKeyword(String keyword) {
        return tasks.values().stream()
                .filter(task -> task.getName() != null && task.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Optional<Task> changeTaskStatus(Long id) {
        Task task = tasks.get(id);
        if (task != null) {
            task.setCompleted(!task.isCompleted());
            return Optional.of(task);
        }
        return Optional.empty();
    }

    public void updateTask(Long id, Task task) {
        tasks.put(id, task);
    }

    public boolean deleteTask(Long id) {
        return tasks.remove(id) != null;
    }
}
