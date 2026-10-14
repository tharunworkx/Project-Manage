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
