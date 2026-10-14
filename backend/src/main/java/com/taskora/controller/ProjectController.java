package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import com.taskora.dto.CreateProjectRequest;
import com.taskora.dto.ProjectDto;
import com.taskora.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "Project creation and retrieval operations")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieves all projects across workspaces")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieves project details by its unique identifier")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable UUID id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @GetMapping("/workspace/{workspaceId}")
    @Operation(summary = "Get projects by workspace", description = "Retrieves all projects belonging to a workspace")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByWorkspace(@PathVariable UUID workspaceId) {
        List<ProjectDto> projects = projectService.getProjectsByWorkspace(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @PostMapping
    @Operation(summary = "Create project", description = "Creates a new project in a workspace")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDto created = projectService.createProject(request);
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project", description = "Updates an existing project")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable UUID id,
            @RequestBody CreateProjectRequest request
    ) {
        ProjectDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Deletes a project by ID")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
