package com.taskora.security;

import com.taskora.model.enums.WorkspaceRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final WorkspaceRole role;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, String email) {
        this(id, email, WorkspaceRole.TEAM_MEMBER, true);
    }

    public UserPrincipal(UUID id, String email, WorkspaceRole role, boolean active) {
        this.id = id;
        this.email = email;
        this.role = role != null ? role : WorkspaceRole.TEAM_MEMBER;
        this.active = active;

        List<SimpleGrantedAuthority> authList = new ArrayList<>();
        authList.add(new SimpleGrantedAuthority("ROLE_USER"));
        switch (this.role) {
            case ADMIN -> authList.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            case PROJECT_MANAGER -> authList.add(new SimpleGrantedAuthority("ROLE_PROJECT_MANAGER"));
            case TEAM_MEMBER -> authList.add(new SimpleGrantedAuthority("ROLE_TEAM_MEMBER"));
        }
        this.authorities = authList;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public WorkspaceRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email != null ? email : (id != null ? id.toString() : "");
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
