package com.example.demo;

import com.example.demo.model.TaskDTORequest;
import com.example.demo.services.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;

@Component
public class TaskAppRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(TaskAppRunner.class);

    private final TaskService taskService;

    public TaskAppRunner(TaskService taskService) {
        this.taskService = taskService;
    }

    public static void main(String[] args) {
        SpringApplication.run(TaskAppRunner.class, args);
    }

    @Override
    public void run(String... args) {
        logger.info("---- Adding tasks ----");
        taskService.addTask(new TaskDTORequest("Buy milk", "Buy 2 bottles of milk"));
        taskService.addTask(new TaskDTORequest("Study Java", "Complete Spring Boot tutorial"));
        taskService.addTask(new TaskDTORequest("Clean room", "Tidy up and vacuum"));

        logger.info("\n---- All tasks ----");
        taskService.getAllTasks().forEach(task -> logger.info(task.toString()));

        logger.info("\n---- Marking task 2 as completed ----");
        taskService.changeTaskStatus(2L);

        logger.info("\n---- All tasks after completion ----");
        taskService.getAllTasks().forEach(task -> logger.info(task.toString()));

        logger.info("\n---- Deleting task 1 ----");
        taskService.deleteTask(1L);

        logger.info("\n---- All tasks after deletion ----");
        taskService.getAllTasks().forEach(task -> logger.info(task.toString()));

        logger.info("\n---- Trying to mark non-existing task ----");
        boolean result = taskService.changeTaskStatus(99L).isPresent();
        logger.info("Was task 99 marked as completed? {}", result);
    }
}
