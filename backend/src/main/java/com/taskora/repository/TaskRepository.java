package com.taskora.repository;

import com.taskora.model.Task;
import com.taskora.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectIdOrderByOrderIndexAsc(UUID projectId);
    List<Task> findByProjectIdAndStatusOrderByOrderIndexAsc(UUID projectId, TaskStatus status);
    List<Task> findByAssigneeId(UUID assigneeId);
}
