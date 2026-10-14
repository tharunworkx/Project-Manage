package com.taskora.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskPriority {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high"),
    URGENT("urgent");

    private final String value;

    TaskPriority(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TaskPriority fromValue(String value) {
        if (value == null) {
            return MEDIUM;
        }
        for (TaskPriority priority : values()) {
            if (priority.value.equalsIgnoreCase(value) || priority.name().equalsIgnoreCase(value)) {
                return priority;
            }
        }
        return MEDIUM;
    }
}
