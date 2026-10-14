package com.taskora.dto;

import com.taskora.model.Profile;

import java.time.Instant;
import java.util.UUID;

public class ProfileDto {
    private UUID id;
    private String fullName;
    private String avatarUrl;
    private Instant createdAt;
    private Instant updatedAt;

    public ProfileDto() {
    }

    public static ProfileDto fromEntity(Profile profile) {
        if (profile == null) return null;
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setFullName(profile.getFullName());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
