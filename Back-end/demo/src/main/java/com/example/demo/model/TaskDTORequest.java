package com.example.demo.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskDTORequest {

    @NotBlank(message = "Name is mandatory")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description can be up to 500 characters")
    private String description;

    public TaskDTORequest(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
