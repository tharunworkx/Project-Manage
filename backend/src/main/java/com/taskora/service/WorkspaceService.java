package com.taskora.service;

import com.taskora.dto.CreateWorkspaceRequest;
import com.taskora.dto.WorkspaceDto;
import com.taskora.exception.BadRequestException;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.model.Workspace;
import com.taskora.model.WorkspaceMember;
import com.taskora.repository.WorkspaceMemberRepository;
import com.taskora.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository,
                            WorkspaceMemberRepository workspaceMemberRepository) {
        this.workspaceRepository = workspaceRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<WorkspaceDto> getAllWorkspaces() {
        return workspaceRepository.findAll().stream()
                .map(WorkspaceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspaceById(UUID id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", "id", id));
        return WorkspaceDto.fromEntity(workspace);
    }

    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspaceBySlug(String slug) {
        Workspace workspace = workspaceRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", "slug", slug));
        return WorkspaceDto.fromEntity(workspace);
    }

    public WorkspaceDto createWorkspace(CreateWorkspaceRequest request, UUID ownerId) {
        if (workspaceRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new BadRequestException("Workspace with slug '" + request.getSlug() + "' already exists");
        }

        Workspace workspace = new Workspace(request.getName(), request.getSlug(), ownerId);
        Workspace saved = workspaceRepository.save(workspace);

        if (ownerId != null) {
            WorkspaceMember member = new WorkspaceMember(saved.getId(), ownerId, "owner");
            workspaceMemberRepository.save(member);
        }

        return WorkspaceDto.fromEntity(saved);
    }

    public void deleteWorkspace(UUID id) {
        if (!workspaceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workspace", "id", id);
        }
        workspaceRepository.deleteById(id);
    }
}
