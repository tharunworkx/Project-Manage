package com.taskora.dto;

import com.taskora.model.Workspace;

import java.time.Instant;
import java.util.UUID;

public class WorkspaceDto {
    private UUID id;
    private String name;
    private String slug;
    private UUID ownerId;
    private Instant createdAt;

    public WorkspaceDto() {
    }

    public static WorkspaceDto fromEntity(Workspace workspace) {
        if (workspace == null) return null;
        WorkspaceDto dto = new WorkspaceDto();
        dto.setId(workspace.getId());
        dto.setName(workspace.getName());
        dto.setSlug(workspace.getSlug());
        dto.setOwnerId(workspace.getOwnerId());
        dto.setCreatedAt(workspace.getCreatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
