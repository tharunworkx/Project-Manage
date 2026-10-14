package com.taskora.repository;

import com.taskora.model.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LabelRepository extends JpaRepository<Label, UUID> {
    List<Label> findByWorkspaceId(UUID workspaceId);
}
