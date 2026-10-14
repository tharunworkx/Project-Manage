package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import com.taskora.dto.CreateTaskRequest;
import com.taskora.dto.TaskDto;
import com.taskora.dto.UpdateTaskRequest;
import com.taskora.model.enums.TaskStatus;
import com.taskora.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "Task management and Kanban board operations")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @Operation(summary = "Get all tasks", description = "Retrieves all tasks across projects")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves details for a specific task")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(@PathVariable UUID id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get tasks by project", description = "Retrieves all tasks belonging to a specific project")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByProject(
            @PathVariable UUID projectId,
            @RequestParam(required = false) String status
    ) {
        List<TaskDto> tasks;
        if (status != null && !status.isBlank()) {
            tasks = taskService.getTasksByProjectAndStatus(projectId, TaskStatus.fromValue(status));
        } else {
            tasks = taskService.getTasksByProject(projectId);
        }
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PostMapping
    @Operation(summary = "Create task", description = "Creates a new task in a project")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto created = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Updates an existing task's fields, status, or assignee")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable UUID id,
            @RequestBody UpdateTaskRequest request
    ) {
        TaskDto updated = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task", description = "Deletes a task by ID")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
