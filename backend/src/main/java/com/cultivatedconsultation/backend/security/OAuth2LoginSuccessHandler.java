package com.cultivatedconsultation.backend.security;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);

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

        // Every deployed environment must override app.frontend-base-url
        // (APP_FRONTEND_BASE_URL) away from the localhost default in
        // application.yml. If it's still localhost here, every Google login on
        // that deployment will silently redirect the visitor's browser to their
        // own machine instead of back to the real site — this log line is the
        // only signal you'll get, since the browser just shows a dead
        // localhost page with no server-side error.
        if (frontendBaseUrl != null && frontendBaseUrl.contains("localhost")) {
            log.warn("app.frontend-base-url is still '{}' — if this is a deployed environment, "
                    + "set APP_FRONTEND_BASE_URL to the real public URL or post-login redirects "
                    + "will send users to localhost.", frontendBaseUrl);
        }
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
