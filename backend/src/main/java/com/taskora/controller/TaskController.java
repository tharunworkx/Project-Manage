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

import com.taskora.exception.BadRequestException;
import com.taskora.model.enums.WorkspaceRole;
import com.taskora.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "Role-based task management and Kanban board operations")
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
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canAccessProject(#projectId, principal)")
    @Operation(summary = "Get tasks by project", description = "Retrieves all tasks for an authorized project")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByProject(
            @PathVariable UUID projectId,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserPrincipal principal
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
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canCreateTask(#request.projectId, principal)")
    @Operation(summary = "Create task", description = "Creates a new task in a project (Admin or Project Manager only)")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        TaskDto created = taskService.createTask(request);
        return new ResponseEntity<>(ApiResponse.success("Task created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageTask(#id, principal) or @projectSecurity.canUpdateTaskStatus(#id, principal)")
    @Operation(summary = "Update task", description = "Updates an existing task; Team Members are restricted to status updates")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable UUID id,
            @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        // Enforce backend restriction: Team Members cannot edit task metadata (title, due date, assignee, priority), only status
        if (principal != null && principal.getRole() == WorkspaceRole.TEAM_MEMBER) {
            UpdateTaskRequest statusOnlyRequest = new UpdateTaskRequest();
            statusOnlyRequest.setStatus(request.getStatus());
            TaskDto updated = taskService.updateTask(id, statusOnlyRequest);
            return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updated));
        }

        TaskDto updated = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageTask(#id, principal)")
    @Operation(summary = "Delete task", description = "Deletes a task by ID (Admin or Project Manager only)")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
