package com.taskora.security;

import com.taskora.model.Project;
import com.taskora.model.Task;
import com.taskora.model.enums.WorkspaceRole;
import com.taskora.repository.ProjectMemberRepository;
import com.taskora.repository.ProjectRepository;
import com.taskora.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service("projectSecurity")
public class ProjectSecurityService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;

    public ProjectSecurityService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            TaskRepository taskRepository
    ) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
    }

    /**
     * Check if a user can view or access project details and tasks.
     * Admin: Has company-wide access to all projects.
     * Project Manager: Can access projects they oversee or belong to.
     * Team Member: Can only access projects where membership has been assigned.
     */
    public boolean canAccessProject(UUID projectId, UserPrincipal principal) {
        if (principal == null || projectId == null) {
            return false;
        }
        if (principal.getRole() == WorkspaceRole.ADMIN) {
            return true;
        }

        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return false;
        }
        Project project = projectOpt.get();

        if (principal.getId().equals(project.getProjectManagerId())) {
            return true;
        }

        return projectMemberRepository.existsByProjectIdAndUserId(projectId, principal.getId());
    }

    /**
     * Check if a user can edit/delete/manage a project or assign members to it.
     * Admin: Yes.
     * Project Manager: Yes, for authorized projects where they are assigned PM or PM member.
     * Team Member: No.
     */
    public boolean canManageProject(UUID projectId, UserPrincipal principal) {
        if (principal == null || projectId == null) {
            return false;
        }
        if (principal.getRole() == WorkspaceRole.ADMIN) {
            return true;
        }
        if (principal.getRole() != WorkspaceRole.PROJECT_MANAGER) {
            return false;
        }

        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return false;
        }
        Project project = projectOpt.get();

        if (principal.getId().equals(project.getProjectManagerId())) {
            return true;
        }

        var memberOpt = projectMemberRepository.findByProjectIdAndUserId(projectId, principal.getId());
        return memberOpt.isPresent() && "project_manager".equalsIgnoreCase(memberOpt.get().getRoleInProject());
    }

    /**
     * Check if user can create tasks within a project.
     * Admin: Yes.
     * Project Manager: Yes, for projects they manage.
     * Team Member: No (Team members cannot create tasks).
     */
    public boolean canCreateTask(UUID projectId, UserPrincipal principal) {
        return canManageProject(projectId, principal);
    }

    /**
     * Check if user can delete tasks or update task metadata (title, due date, assignee, priority).
     * Admin: Yes.
     * Project Manager: Yes, within their projects.
     * Team Member: No.
     */
    public boolean canManageTask(UUID taskId, UserPrincipal principal) {
        if (principal == null || taskId == null) {
            return false;
        }
        if (principal.getRole() == WorkspaceRole.ADMIN) {
            return true;
        }

        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            return false;
        }
        return canManageProject(taskOpt.get().getProjectId(), principal);
    }

    /**
     * Check if user can update status or comment on a task.
     * Admin: Yes.
     * Project Manager: Yes.
     * Team Member: Yes, if assigned to task or member of the project.
     */
    public boolean canUpdateTaskStatus(UUID taskId, UserPrincipal principal) {
        if (principal == null || taskId == null) {
            return false;
        }
        if (principal.getRole() == WorkspaceRole.ADMIN) {
            return true;
        }

        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            return false;
        }
        Task task = taskOpt.get();

        if (principal.getRole() == WorkspaceRole.PROJECT_MANAGER) {
            return canAccessProject(task.getProjectId(), principal);
        }

        // Team Member
        if (principal.getId().equals(task.getAssigneeId())) {
            return true;
        }
        return canAccessProject(task.getProjectId(), principal);
    }
}
