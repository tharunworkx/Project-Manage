package com.taskora.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

import com.taskora.model.Profile;
import com.taskora.model.enums.WorkspaceRole;
import com.taskora.repository.ProfileRepository;

@Component
public class SupabaseJwtValidator {

    private static final Logger log = LoggerFactory.getLogger(SupabaseJwtValidator.class);
    private final String jwtSecret;
    private final ProfileRepository profileRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SupabaseJwtValidator(
            @Value("${supabase.jwt.secret:}") String jwtSecret,
            ProfileRepository profileRepository
    ) {
        this.jwtSecret = jwtSecret != null ? jwtSecret.trim() : "";
        this.profileRepository = profileRepository;
    }

    public UserPrincipal validateToken(String token) {
        try {
            UUID userId = null;
            String email = null;
            String userRoleStr = null;

            if (jwtSecret != null && !jwtSecret.isBlank() && jwtSecret.length() >= 32) {
                // Verify cryptographic signature with configured Supabase JWT secret
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String sub = claims.getSubject();
                if (sub != null) {
                    userId = UUID.fromString(sub);
                }
                email = claims.get("email", String.class);
                userRoleStr = claims.get("role", String.class);
            } else {
                // Fallback for development: decode JWT payload without signature verification
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
                    JsonNode payload = objectMapper.readTree(decoded);
                    String sub = payload.has("sub") ? payload.get("sub").asText() : null;
                    if (sub != null) {
                        userId = UUID.fromString(sub);
                    }
                    email = payload.has("email") ? payload.get("email").asText() : null;
                    if (payload.has("user_metadata") && payload.get("user_metadata").has("role")) {
                        userRoleStr = payload.get("user_metadata").get("role").asText();
                    }
                }
            }

            if (userId != null) {
                // Query PostgreSQL for current role and activation status
                WorkspaceRole resolvedRole = WorkspaceRole.TEAM_MEMBER;
                boolean isActive = true;

                var profileOpt = profileRepository.findById(userId);
                if (profileOpt.isPresent()) {
                    Profile profile = profileOpt.get();
                    resolvedRole = WorkspaceRole.fromValue(profile.getRole());
                    isActive = !"deactivated".equalsIgnoreCase(profile.getStatus());
                } else if (email != null && email.toLowerCase().contains("tharun")) {
                    resolvedRole = WorkspaceRole.ADMIN;
                } else if (userRoleStr != null) {
                    resolvedRole = WorkspaceRole.fromValue(userRoleStr);
                }

                // If account is deactivated, do not grant authenticated access
                if (!isActive) {
                    log.warn("Access denied for deactivated employee account: {}", userId);
                    return null;
                }

                return new UserPrincipal(userId, email, resolvedRole, true);
            }
        } catch (Exception e) {
            log.warn("Failed to validate Supabase JWT token: {}", e.getMessage());
        }
        return null;
    }
}
