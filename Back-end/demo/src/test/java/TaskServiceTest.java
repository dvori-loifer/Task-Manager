import com.example.demo.model.Task;
import com.example.demo.model.TaskDTORequest;
import com.example.demo.repositories.TaskRepository;
import com.example.demo.services.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TaskServiceTest {

    private TaskRepository repository;
    private TaskService service;

    @BeforeEach
    void setUp() {
        repository = mock(TaskRepository.class);
        service = new TaskService(repository);
    }

    @Test
    void testAddTask() {
        TaskDTORequest dto = new TaskDTORequest("Test", "desc");
        Task task = new Task(dto.getName(), dto.getDescription());
        task.setId(1L);
        when(repository.addTask(any(Task.class))).thenReturn(task);
        Task result = service.addTask(dto);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(dto.getName(), result.getName());
        assertEquals(dto.getDescription(), result.getDescription());
        verify(repository).addTask(any(Task.class));
    }

    @Test
    void testGetAllTasks() {
        List<Task> list = List.of(new Task("A", "desc"), new Task("B", "desc"));
        when(repository.getAllTasks()).thenReturn(list);
        List<Task> result = service.getAllTasks();
        assertEquals(2, result.size());
        verify(repository).getAllTasks();
    }

    @Test
    void testFindTaskById_Found() {
        Task task = new Task("FindMe", "desc");
        when(repository.findTaskById(5L)).thenReturn(Optional.of(task));
        Optional<Task> result = service.findTaskById(5L);
        assertTrue(result.isPresent());
        assertEquals("FindMe", result.get().getName());
        verify(repository).findTaskById(5L);
    }

    @Test
    void testFindTaskById_NotFound() {
        when(repository.findTaskById(99L)).thenReturn(Optional.empty());
        Optional<Task> result = service.findTaskById(99L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetCompleteTasks() {
        Task t1 = new Task("Done1", "desc");
        t1.setCompleted(true);
        Task t2 = new Task("Done2", "desc");
        t2.setCompleted(true);
        when(repository.getCompleteTasks()).thenReturn(List.of(t1, t2));
        List<Task> result = service.getCompleteTasks();
        assertEquals(2, result.size());
    }

    @Test
    void testSearchTasksByKeyword() {
        Task t1 = new Task("Study Java", "desc");
        when(repository.searchTasksByKeyword("java")).thenReturn(List.of(t1));
        List<Task> result = service.searchTasksByKeyword("java");
        assertEquals(1, result.size());
        assertEquals("Study Java", result.get(0).getName());
    }

    @Test
    void testChangeTaskStatus_Found() {
        Task t = new Task("Toggle", "desc");
        t.setCompleted(false);
        when(repository.changeTaskStatus(1L)).thenReturn(Optional.of(t));
        Optional<Task> result = service.changeTaskStatus(1L);
        assertTrue(result.isPresent());
        assertFalse(result.get().isCompleted()); // לפי הדמיה שלך זה משאיר את הערך הנוכחי
    }

    @Test
    void testChangeTaskStatus_NotFound() {
        when(repository.changeTaskStatus(100L)).thenReturn(Optional.empty());
        Optional<Task> result = service.changeTaskStatus(100L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testUpdateTask() {
        Task updatedTask = new Task("Updated", "desc");
        service.updateTask(3L, updatedTask);
        verify(repository).updateTask(3L, updatedTask);
    }

    @Test
    void testDeleteTask_True() {
        when(repository.deleteTask(4L)).thenReturn(true);
        boolean result = service.deleteTask(4L);
        assertTrue(result);
        verify(repository).deleteTask(4L);
    }

    @Test
    void testDeleteTask_False() {
        when(repository.deleteTask(4L)).thenReturn(false);
        boolean result = service.deleteTask(4L);
        assertFalse(result);
    }
}
