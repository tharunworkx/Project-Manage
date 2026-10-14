package com.taskora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateCommentRequest {

    @NotNull(message = "taskId is required")
    private UUID taskId;

    @NotBlank(message = "content is required")
    private String content;

    public CreateCommentRequest() {
    }

    public CreateCommentRequest(UUID taskId, String content) {
        this.taskId = taskId;
        this.content = content;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
