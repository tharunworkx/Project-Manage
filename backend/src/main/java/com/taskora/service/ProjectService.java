package com.taskora.service;

import com.taskora.dto.CreateProjectRequest;
import com.taskora.dto.ProjectDto;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.model.Project;
import com.taskora.model.ProjectMember;
import com.taskora.repository.ProjectRepository;
import com.taskora.repository.ProjectMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ProjectService(ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Enforces database-level authorization:
     * - Admin: views all company projects
     * - Project Manager: views projects they oversee or are a member of
     * - Team Member: views strictly authorized projects where they are assigned
     */
    @Transactional(readOnly = true)
    public List<ProjectDto> getAuthorizedProjects(com.taskora.security.UserPrincipal principal) {
        if (principal == null) {
            return List.of();
        }
        if (principal.getRole() == com.taskora.model.enums.WorkspaceRole.ADMIN) {
            return getAllProjects();
        }

        List<UUID> memberProjectIds = projectMemberRepository.findByUserId(principal.getId()).stream()
                .map(com.taskora.model.ProjectMember::getProjectId)
                .collect(Collectors.toList());

        return projectRepository.findAll().stream()
                .filter(p -> principal.getId().equals(p.getProjectManagerId()) || memberProjectIds.contains(p.getId()))
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

    public ProjectDto createProject(CreateProjectRequest request, com.taskora.security.UserPrincipal principal) {
        Project project = new Project();
        project.setWorkspaceId(request.getWorkspaceId());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setColor(request.getColor() != null ? request.getColor() : "#4f46e5");

        if (request.getProjectManagerId() != null) {
            project.setProjectManagerId(request.getProjectManagerId());
        } else if (principal != null && principal.getRole() == com.taskora.model.enums.WorkspaceRole.PROJECT_MANAGER) {
            project.setProjectManagerId(principal.getId());
        }

        Project saved = projectRepository.save(project);

        // Add creator/PM to project members
        if (saved.getProjectManagerId() != null) {
            projectMemberRepository.save(new com.taskora.model.ProjectMember(
                    saved.getId(),
                    saved.getProjectManagerId(),
                    "project_manager"
            ));
        }

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
        if (request.getProjectManagerId() != null) {
            project.setProjectManagerId(request.getProjectManagerId());
        }

        Project updated = projectRepository.save(project);
        return ProjectDto.fromEntity(updated);
    }

    public ProjectDto assignProjectManager(UUID projectId, UUID projectManagerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        project.setProjectManagerId(projectManagerId);
        Project updated = projectRepository.save(project);

        if (projectManagerId != null) {
            if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, projectManagerId)) {
                projectMemberRepository.save(new com.taskora.model.ProjectMember(
                        projectId,
                        projectManagerId,
                        "project_manager"
                ));
            }
        }
        return ProjectDto.fromEntity(updated);
    }

    public void addMemberToProject(UUID projectId, UUID userId, String roleInProject) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }
        var existing = projectMemberRepository.findByProjectIdAndUserId(projectId, userId);
        if (existing.isPresent()) {
            var member = existing.get();
            member.setRoleInProject(roleInProject != null ? roleInProject : "team_member");
            projectMemberRepository.save(member);
        } else {
            projectMemberRepository.save(new com.taskora.model.ProjectMember(
                    projectId,
                    userId,
                    roleInProject != null ? roleInProject : "team_member"
            ));
        }
    }

    public void removeMemberFromProject(UUID projectId, UUID userId) {
        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    @Transactional(readOnly = true)
    public List<com.taskora.model.ProjectMember> getProjectMembers(UUID projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectMemberRepository.deleteByProjectId(id);
        projectRepository.deleteById(id);
    }
}
