package com.taskora.service;

import com.taskora.dto.ProfileDto;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.model.Profile;
import com.taskora.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<ProfileDto> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(ProfileDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfileById(UUID id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));
        return ProfileDto.fromEntity(profile);
    }

    public ProfileDto createProfile(ProfileDto request) {
        UUID id = request.getId() != null ? request.getId() : UUID.randomUUID();
        Profile profile = new Profile();
        profile.setId(id);
        profile.setFullName(request.getFullName() != null ? request.getFullName() : "New Employee");
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setRole(request.getRole() != null ? request.getRole() : "team_member");
        profile.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        
        Profile saved = profileRepository.save(profile);
        return ProfileDto.fromEntity(saved);
    }

    public ProfileDto updateProfile(UUID id, ProfileDto request, boolean isAdmin) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName());
        }
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }

        // Only ADMIN can change role and activation status
        if (isAdmin) {
            if (request.getRole() != null) {
                profile.setRole(request.getRole());
            }
            if (request.getStatus() != null) {
                profile.setStatus(request.getStatus());
            }
        }

        Profile saved = profileRepository.save(profile);
        return ProfileDto.fromEntity(saved);
    }

    public ProfileDto updateStatus(UUID id, String status) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));
        profile.setStatus(status != null ? status : "active");
        Profile saved = profileRepository.save(profile);
        return ProfileDto.fromEntity(saved);
    }

    public ProfileDto updateRole(UUID id, String role) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));
        profile.setRole(role != null ? role : "team_member");
        Profile saved = profileRepository.save(profile);
        return ProfileDto.fromEntity(saved);
    }

    public ProfileDto upsertProfile(UUID id, String fullName, String avatarUrl, String role) {
        Profile profile = profileRepository.findById(id).orElseGet(() -> {
            Profile p = new Profile();
            p.setId(id);
            return p;
        });

        if (fullName != null) {
            profile.setFullName(fullName);
        }
        if (avatarUrl != null) {
            profile.setAvatarUrl(avatarUrl);
        }
        if (role != null) {
            profile.setRole(role);
        }

        Profile saved = profileRepository.save(profile);
        return ProfileDto.fromEntity(saved);
    }
}
