# Task Manager 

A simple RESTful API for managing tasks, built with Spring Boot.

## Features

- Create new tasks
- Get all tasks or a single task by ID
- Search tasks by keyword
- View completed tasks only
- Update task details
- Toggle task completion
- Delete tasks

## Tech Stack

- Java 21
- Spring Boot
- Maven

## Running the Project

Make sure you have Java and Maven installed.

```
mvn spring-boot:run
```

The server will start on `http://localhost:8081`.

## Endpoints

- `POST /tasks` – Create task
- `GET /tasks` – Get all tasks
- `GET /tasks/{id}` – Get task by ID
- `GET /tasks/search?keyword=...` – Search tasks
- `GET /tasks/completed` – Get completed tasks
- `PUT /tasks/{id}` – Update task
- `PUT /tasks/{id}/toggle-completed` – Toggle completion
- `DELETE /tasks/{id}` – Delete task
