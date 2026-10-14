package com.taskora.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkspaceRole {
    OWNER("owner"),
    ADMIN("admin"),
    MEMBER("member");

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
            return MEMBER;
        }
        for (WorkspaceRole role : values()) {
            if (role.value.equalsIgnoreCase(value) || role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        return MEMBER;
    }
}
