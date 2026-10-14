package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Application health and status endpoints")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check service health", description = "Returns system status, service name, and uptime")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("service", "taskora-backend");
        data.put("version", "1.0.0");
        data.put("uptimeMs", ManagementFactory.getRuntimeMXBean().getUptime());

        return ResponseEntity.ok(ApiResponse.success("Service is healthy", data));
    }
}
