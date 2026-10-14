package com.taskora.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkspaceRole {
    ADMIN("admin"),
    PROJECT_MANAGER("project_manager"),
    TEAM_MEMBER("team_member");

    private final String value;

    WorkspaceRole(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static WorkspaceRole fromValue(String value) {
        if (value == null) {
            return TEAM_MEMBER;
        }
        String clean = value.trim().toLowerCase();
        if (clean.equals("owner") || clean.equals("admin")) {
            return ADMIN;
        }
        if (clean.equals("project_manager") || clean.equals("pm") || clean.equals("manager")) {
            return PROJECT_MANAGER;
        }
        if (clean.equals("member") || clean.equals("team_member")) {
            return TEAM_MEMBER;
        }
        for (WorkspaceRole role : values()) {
            if (role.value.equalsIgnoreCase(value) || role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        return TEAM_MEMBER;
    }
}
