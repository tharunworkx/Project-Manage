package com.taskora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateWorkspaceRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    public CreateWorkspaceRequest() {
    }

    public CreateWorkspaceRequest(String name, String slug) {
        this.name = name;
        this.slug = slug;
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
}
