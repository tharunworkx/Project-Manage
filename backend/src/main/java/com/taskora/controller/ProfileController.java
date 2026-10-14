package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import com.taskora.dto.ProfileDto;
import com.taskora.security.UserPrincipal;
import com.taskora.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profiles")
@Tag(name = "Profiles", description = "User profile operations")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "Get all user profiles", description = "Retrieves all user profiles")
    public ResponseEntity<ApiResponse<List<ProfileDto>>> getAllProfiles() {
        List<ProfileDto> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(ApiResponse.success(profiles));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated profile", description = "Retrieves profile of the currently logged in Supabase user")
    public ResponseEntity<ApiResponse<ProfileDto>> getCurrentProfile(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null || principal.getId() == null) {
            return ResponseEntity.ok(ApiResponse.error("Unauthenticated user"));
        }
        ProfileDto profile = profileService.getProfileById(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get profile by ID", description = "Retrieves user profile by user UUID")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfileById(@PathVariable UUID id) {
        ProfileDto profile = profileService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create employee account", description = "Admin creates a new employee profile with specified role")
    public ResponseEntity<ApiResponse<ProfileDto>> createProfile(
            @RequestBody ProfileDto request
    ) {
        ProfileDto created = profileService.createProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Employee account created successfully", created));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN') or (principal != null and principal.id == #id)")
    @Operation(summary = "Update employee profile", description = "Updates full name, avatar. Role and status require Admin.")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(
            @PathVariable UUID id,
            @RequestBody ProfileDto request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isAdmin = principal != null && principal.getRole() == com.taskora.model.enums.WorkspaceRole.ADMIN;
        ProfileDto updated = profileService.updateProfile(id, request, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate or deactivate employee account", description = "Admin sets status to active or deactivated")
    public ResponseEntity<ApiResponse<ProfileDto>> updateStatus(
            @PathVariable UUID id,
            @RequestBody ProfileDto request
    ) {
        ProfileDto updated = profileService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Employee status updated", updated));
    }

    @PatchMapping("/{id}/role")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee role", description = "Admin assigns role: admin, project_manager, or team_member")
    public ResponseEntity<ApiResponse<ProfileDto>> updateRole(
            @PathVariable UUID id,
            @RequestBody ProfileDto request
    ) {
        ProfileDto updated = profileService.updateRole(id, request.getRole());
        return ResponseEntity.ok(ApiResponse.success("Employee role updated", updated));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate employee account", description = "Admin deactivates an employee account")
    public ResponseEntity<ApiResponse<ProfileDto>> deactivateProfile(@PathVariable UUID id) {
        ProfileDto updated = profileService.updateStatus(id, "deactivated");
        return ResponseEntity.ok(ApiResponse.success("Employee account deactivated successfully", updated));
    }
}
