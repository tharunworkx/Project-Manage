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

@Component
public class SupabaseJwtValidator {

    private static final Logger log = LoggerFactory.getLogger(SupabaseJwtValidator.class);
    private final String jwtSecret;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SupabaseJwtValidator(@Value("${supabase.jwt.secret:}") String jwtSecret) {
        this.jwtSecret = jwtSecret != null ? jwtSecret.trim() : "";
    }

    public UserPrincipal validateToken(String token) {
        try {
            if (jwtSecret != null && !jwtSecret.isBlank() && jwtSecret.length() >= 32) {
                // Verify cryptographic signature with configured Supabase JWT secret
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String sub = claims.getSubject();
                String email = claims.get("email", String.class);
                return new UserPrincipal(UUID.fromString(sub), email);
            } else {
                // Fallback for development: decode JWT payload without signature verification
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
                    JsonNode payload = objectMapper.readTree(decoded);
                    String sub = payload.has("sub") ? payload.get("sub").asText() : null;
                    String email = payload.has("email") ? payload.get("email").asText() : null;

                    if (sub != null) {
                        return new UserPrincipal(UUID.fromString(sub), email);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to validate Supabase JWT token: {}", e.getMessage());
        }
        return null;
    }
}
