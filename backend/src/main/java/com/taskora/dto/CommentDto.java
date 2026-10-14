package com.taskora.dto;

import com.taskora.model.Comment;

import java.time.Instant;
import java.util.UUID;

public class CommentDto {
    private UUID id;
    private UUID taskId;
    private UUID userId;
    private String content;
    private Instant createdAt;

    public CommentDto() {
    }

    public static CommentDto fromEntity(Comment comment) {
        if (comment == null) return null;
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setTaskId(comment.getTaskId());
        dto.setUserId(comment.getUserId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
