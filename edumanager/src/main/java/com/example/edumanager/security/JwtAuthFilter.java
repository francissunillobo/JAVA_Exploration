package com.example.edumanager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter.
 * 
 * This filter intercepts every request and:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Validates the token
 * 3. Loads user details and sets authentication in SecurityContext
 * 
 * Flow:
 * Request -> Extract Token -> Validate -> Load UserDetails -> Set Authentication -> Continue
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * Main filter method - processes each request.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Step 1: Extract JWT token from request header
            String jwt = parseJwt(request);
            
            // Step 2: If token exists and is valid
            if (jwt != null && jwtUtils.validateToken(jwt)) {
                
                // Step 3: Extract username from token
                String username = jwtUtils.getUsernameFromToken(jwt);
                
                // Step 4: Load user details from database/memory
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // Step 5: Create authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,  // credentials not needed after authentication
                                userDetails.getAuthorities()
                        );
                
                // Step 6: Set additional details
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // Step 7: Set authentication in SecurityContext
                // This makes the user "logged in" for this request
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                logger.debug("User '{}' authenticated successfully", username);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from Authorization header.
     * Expected format: "Bearer <token>"
     * 
     * @param request HTTP request
     * @return JWT token string or null if not found
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);  // Remove "Bearer " prefix
        }

        return null;
    }
}

