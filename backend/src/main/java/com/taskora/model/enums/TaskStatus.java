package com.taskora.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    TODO("todo"),
    IN_PROGRESS("in_progress"),
    IN_REVIEW("in_review"),
    DONE("done");

    private final String value;

    TaskStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TaskStatus fromValue(String value) {
        if (value == null) {
            return TODO;
        }
        for (TaskStatus status : values()) {
            if (status.value.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return TODO;
    }
}
