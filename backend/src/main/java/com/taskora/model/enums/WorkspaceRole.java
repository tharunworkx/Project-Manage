package com.taskora.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkspaceRole {
    ADMIN("admin"),
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
        if (clean.equals("owner") || clean.equals("admin") || clean.equals("project_manager") || clean.equals("pm")) {
            return ADMIN;
        }
        return TEAM_MEMBER;
    }
}
