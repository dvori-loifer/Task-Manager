package com.example.demo.model;

import lombok.Data;

@Data
public class TaskDTOResponse {

    private Long id;
    private String name;
    private String description;
    private boolean completed;

    public TaskDTOResponse(Long id, String name, String description, boolean completed) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.completed = completed;
    }

    public TaskDTOResponse(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.description = task.getDescription();
        this.completed = task.isCompleted();
    }
}
