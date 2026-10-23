package com.taskora.controller;

import com.taskora.dto.ApiResponse;
import com.taskora.model.Notification;
import com.taskora.repository.NotificationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notifications", description = "Notification management operations")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    @Operation(summary = "Get all notifications", description = "Retrieves all notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getAllNotifications(
            @RequestParam(required = false) UUID userId
    ) {
        List<Notification> notifications;
        if (userId != null) {
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PostMapping
    @Operation(summary = "Create notification", description = "Creates a new notification")
    public ResponseEntity<ApiResponse<Notification>> createNotification(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.getOrDefault("title", "New Notification");
        String message = (String) payload.getOrDefault("message", "");
        UUID userId = null;
        if (payload.get("userId") != null || payload.get("user_id") != null) {
            try {
                String rawUser = (String) (payload.get("userId") != null ? payload.get("userId") : payload.get("user_id"));
                userId = UUID.fromString(rawUser);
            } catch (Exception ignored) {}
        }
        Notification notification = new Notification(userId, title, message);
        Notification saved = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Marks a specific notification as read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(@PathVariable UUID id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setRead(true);
            Notification updated = notificationRepository.save(notif);
            return ResponseEntity.ok(ApiResponse.success(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Marks all notifications as read")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(@RequestParam(required = false) UUID userId) {
        List<Notification> list = (userId != null)
                ? notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : notificationRepository.findAll();
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification", description = "Permanently deletes a notification")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable UUID id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    @Operation(summary = "Clear all notifications", description = "Deletes all notifications")
    public ResponseEntity<ApiResponse<String>> clearAll(@RequestParam(required = false) UUID userId) {
        if (userId != null) {
            List<Notification> userNotifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
            notificationRepository.deleteAll(userNotifs);
        } else {
            notificationRepository.deleteAll();
        }
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared successfully"));
    }
}
