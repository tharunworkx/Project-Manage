package com.taskora.service;

import com.taskora.dto.CreateTaskRequest;
import com.taskora.dto.TaskDto;
import com.taskora.dto.UpdateTaskRequest;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.model.Task;
import com.taskora.model.enums.TaskStatus;
import com.taskora.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProject(UUID projectId) {
        return taskRepository.findByProjectIdOrderByOrderIndexAsc(projectId).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectAndStatus(UUID projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatusOrderByOrderIndexAsc(projectId, status).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return TaskDto.fromEntity(task);
    }

    public TaskDto createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setProjectId(request.getProjectId());
        task.setAssigneeId(request.getAssigneeId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);

        Task saved = taskRepository.save(task);
        return TaskDto.fromEntity(saved);
    }

    public TaskDto updateTask(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getAssigneeId() != null) {
            task.setAssigneeId(request.getAssigneeId());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getOrderIndex() != null) {
            task.setOrderIndex(request.getOrderIndex());
        }

        Task updated = taskRepository.save(task);
        return TaskDto.fromEntity(updated);
    }

    public void deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }
}
