package com.taskora.dto;

import com.taskora.model.Task;
import com.taskora.model.enums.TaskPriority;
import com.taskora.model.enums.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public class TaskDto {
    private UUID id;
    private UUID projectId;
    private UUID assigneeId;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private Instant dueDate;
    private Integer orderIndex;
    private Instant createdAt;
    private Instant updatedAt;

    public TaskDto() {
    }

    public static TaskDto fromEntity(Task task) {
        if (task == null) return null;
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setProjectId(task.getProjectId());
        dto.setAssigneeId(task.getAssigneeId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setOrderIndex(task.getOrderIndex());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
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
