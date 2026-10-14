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

    @PutMapping("/{id}")
    @Operation(summary = "Update or create profile", description = "Updates full name, avatar URL, or role for user")
    public ResponseEntity<ApiResponse<ProfileDto>> upsertProfile(
            @PathVariable UUID id,
            @RequestBody ProfileDto request
    ) {
        ProfileDto updated = profileService.upsertProfile(id, request.getFullName(), request.getAvatarUrl(), request.getRole());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
