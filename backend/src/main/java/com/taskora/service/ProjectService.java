package com.taskora.service;

import com.taskora.dto.CreateProjectRequest;
import com.taskora.dto.ProjectDto;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.model.Project;
import com.taskora.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsByWorkspace(UUID workspaceId) {
        return projectRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId).stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return ProjectDto.fromEntity(project);
    }

    public ProjectDto createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setWorkspaceId(request.getWorkspaceId());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setColor(request.getColor() != null ? request.getColor() : "#4f46e5");

        Project saved = projectRepository.save(project);
        return ProjectDto.fromEntity(saved);
    }

    public ProjectDto updateProject(UUID id, CreateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getColor() != null) {
            project.setColor(request.getColor());
        }

        Project updated = projectRepository.save(project);
        return ProjectDto.fromEntity(updated);
    }

    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }
}
