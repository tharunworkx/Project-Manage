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

import com.taskora.model.ProjectMember;
import com.taskora.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "Role-based project creation, management, and membership operations")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Get authorized projects", description = "Retrieves all company projects for Admin, or only authorized projects for PM and Team Members")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getAllProjects(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProjectDto> projects = (principal != null)
                ? projectService.getAuthorizedProjects(principal)
                : projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canAccessProject(#id, principal)")
    @Operation(summary = "Get project by ID", description = "Retrieves project details if user is authorized to access it")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @GetMapping("/workspace/{workspaceId}")
    @Operation(summary = "Get projects by workspace", description = "Retrieves all authorized projects belonging to a workspace")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjectsByWorkspace(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProjectDto> projects = (principal != null)
                ? projectService.getAuthorizedProjects(principal)
                : projectService.getProjectsByWorkspace(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_MANAGER')")
    @Operation(summary = "Create project", description = "Creates a new project (Admin or Project Manager only)")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProjectDto created = projectService.createProject(request, principal);
        return new ResponseEntity<>(ApiResponse.success("Project created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageProject(#id, principal)")
    @Operation(summary = "Update project", description = "Updates an existing project (Admin or assigned Project Manager)")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable UUID id,
            @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProjectDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @PatchMapping("/{id}/assign-pm")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign Project Manager", description = "Assigns a Project Manager to a project (Admin only)")
    public ResponseEntity<ApiResponse<ProjectDto>> assignProjectManager(
            @PathVariable UUID id,
            @RequestParam UUID projectManagerId
    ) {
        ProjectDto updated = projectService.assignProjectManager(id, projectManagerId);
        return ResponseEntity.ok(ApiResponse.success("Project Manager assigned successfully", updated));
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canAccessProject(#id, principal)")
    @Operation(summary = "Get project members", description = "Retrieves members assigned to this project")
    public ResponseEntity<ApiResponse<List<ProjectMember>>> getProjectMembers(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProjectMember> members = projectService.getProjectMembers(id);
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageProject(#id, principal)")
    @Operation(summary = "Add member to project", description = "Assigns an existing team member to the project (Admin or PM)")
    public ResponseEntity<ApiResponse<Void>> addProjectMember(
            @PathVariable UUID id,
            @RequestParam UUID userId,
            @RequestParam(required = false, defaultValue = "team_member") String role,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        projectService.addMemberToProject(id, userId, role);
        return ResponseEntity.ok(ApiResponse.success("Team member added to project", null));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageProject(#id, principal)")
    @Operation(summary = "Remove member from project", description = "Removes a team member from the project (Admin or PM)")
    public ResponseEntity<ApiResponse<Void>> removeProjectMember(
            @PathVariable UUID id,
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        projectService.removeMemberFromProject(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Team member removed from project", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @projectSecurity.canManageProject(#id, principal)")
    @Operation(summary = "Delete project", description = "Deletes a project by ID (Admin or Project Manager)")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}
