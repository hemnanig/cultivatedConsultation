package com.cultivatedconsultation.backend.security;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Runs once, right after Google confirms who the user is.
 * First login: create the AppUser row (status PENDING, or APPROVED+admin if their
 * email is in app.admin-emails — a POC stand-in for the real verification console).
 * Every login: redirect back to the frontend so it can call /api/me and route
 * the user to the pending screen or the feed.
 */
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AppUserRepository appUserRepository;
    private final String frontendBaseUrl;
    private final Set<String> adminEmails;

    public OAuth2LoginSuccessHandler(
            AppUserRepository appUserRepository,
            @Value("${app.frontend-base-url}") String frontendBaseUrl,
            @Value("${app.admin-emails}") String adminEmailsCsv
    ) {
        this.appUserRepository = appUserRepository;
        this.frontendBaseUrl = frontendBaseUrl;
        this.adminEmails = adminEmailsCsv == null || adminEmailsCsv.isBlank()
                ? Set.of()
                : Set.copyOf(Arrays.asList(adminEmailsCsv.toLowerCase().split(",")));
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String googleSub = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        appUserRepository.findByGoogleSub(googleSub).orElseGet(() -> {
            AppUser user = new AppUser();
            user.setGoogleSub(googleSub);
            user.setEmail(email);
            user.setName(name);
            boolean isAdmin = email != null && adminEmails.contains(email.toLowerCase());
            user.setAdmin(isAdmin);
            user.setMembershipStatus(isAdmin ? MembershipStatus.APPROVED : MembershipStatus.PENDING);
            return appUserRepository.save(user);
        });

        response.sendRedirect(frontendBaseUrl + "/auth/callback");
    }
}
