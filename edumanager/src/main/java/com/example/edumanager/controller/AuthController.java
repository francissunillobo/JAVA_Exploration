package com.example.edumanager.controller;

import com.example.edumanager.dto.LoginRequest;
import com.example.edumanager.dto.LoginResponse;
import com.example.edumanager.security.JwtUtils;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Authentication Controller.
 * 
 * Handles user authentication (login) and returns JWT tokens.
 * 
 * Endpoints:
 * - POST /api/auth/login - Authenticate and get JWT token
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Login endpoint.
     * 
     * Accepts username/password, validates credentials, and returns JWT token.
     * 
     * Example request:
     * POST /api/auth/login
     * {
     *   "username": "admin",
     *   "password": "admin"
     * }
     * 
     * Example response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiJ9...",
     *   "type": "Bearer",
     *   "username": "admin",
     *   "roles": ["ROLE_ADMIN", "ROLE_USER"]
     * }
     * 
     * @param loginRequest contains username and password
     * @return LoginResponse with JWT token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.debug("Login attempt for user: {}", loginRequest.getUsername());

        try {
            // Step 1: Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Step 2: Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Step 3: Generate JWT token
            String jwt = jwtUtils.generateToken(authentication);

            // Step 4: Get user details for response
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            logger.info("User '{}' logged in successfully with roles: {}", 
                    userDetails.getUsername(), roles);

            // Step 5: Return response with token
            return ResponseEntity.ok(new LoginResponse(
                    jwt,
                    userDetails.getUsername(),
                    roles
            ));

        } catch (AuthenticationException e) {
            logger.warn("Login failed for user '{}': {}", 
                    loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(
                    java.util.Map.of(
                            "error", "Authentication failed",
                            "message", "Invalid username or password"
                    )
            );
        }
    }

    /**
     * Test endpoint to verify authentication.
     * Returns the current user's information if authenticated.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() 
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body(
                    java.util.Map.of("error", "Not authenticated")
            );
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(java.util.Map.of(
                "username", userDetails.getUsername(),
                "roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        ));
    }
}

