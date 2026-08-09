package com.cultivatedconsultation.backend.security;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final AppUserRepository appUserRepository;

    public CurrentUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    /** Resolves the AppUser row for whoever Google says is signed in. Throws if somehow not found. */
    public AppUser resolve(Authentication authentication) {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String googleSub = principal.getAttribute("sub");
        return appUserRepository.findByGoogleSub(googleSub)
                .orElseThrow(() -> new IllegalStateException("Authenticated user has no AppUser record: " + googleSub));
    }
}
