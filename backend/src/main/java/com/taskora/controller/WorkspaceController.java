package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import com.taskora.dto.CreateWorkspaceRequest;
import com.taskora.dto.WorkspaceDto;
import com.taskora.security.UserPrincipal;
import com.taskora.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@Tag(name = "Workspaces", description = "Workspace management operations")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    @Operation(summary = "Get all workspaces", description = "Retrieves all accessible workspaces")
    public ResponseEntity<ApiResponse<List<WorkspaceDto>>> getAllWorkspaces() {
        List<WorkspaceDto> workspaces = workspaceService.getAllWorkspaces();
        return ResponseEntity.ok(ApiResponse.success(workspaces));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workspace by ID", description = "Retrieves workspace details by ID")
    public ResponseEntity<ApiResponse<WorkspaceDto>> getWorkspaceById(@PathVariable UUID id) {
        WorkspaceDto workspace = workspaceService.getWorkspaceById(id);
        return ResponseEntity.ok(ApiResponse.success(workspace));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get workspace by slug", description = "Retrieves workspace details by unique slug")
    public ResponseEntity<ApiResponse<WorkspaceDto>> getWorkspaceBySlug(@PathVariable String slug) {
        WorkspaceDto workspace = workspaceService.getWorkspaceBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(workspace));
    }

    @PostMapping
    @Operation(summary = "Create workspace", description = "Creates a new workspace")
    public ResponseEntity<ApiResponse<WorkspaceDto>> createWorkspace(
            @Valid @RequestBody CreateWorkspaceRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID ownerId = principal != null ? principal.getId() : null;
        WorkspaceDto created = workspaceService.createWorkspace(request, ownerId);
        return new ResponseEntity<>(ApiResponse.success("Workspace created successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete workspace", description = "Deletes a workspace by ID")
    public ResponseEntity<ApiResponse<Void>> deleteWorkspace(@PathVariable UUID id) {
        workspaceService.deleteWorkspace(id);
        return ResponseEntity.ok(ApiResponse.success("Workspace deleted successfully", null));
    }
}
