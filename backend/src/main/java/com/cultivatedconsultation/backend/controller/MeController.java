package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.MeResponse;
import com.cultivatedconsultation.backend.dto.Dtos.SubmitCredentialRequest;
import com.cultivatedconsultation.backend.dto.Dtos.UpdateProfileRequest;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.CredentialStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Deliberately NOT gated on approval status — the frontend needs to be able to
 * ask "who am I and what's my status" in order to decide whether to show the
 * pending screen or the feed. Profile editing (PATCH) is likewise open to
 * pending users so they can fill in their badge/bio/specialties while waiting
 * on approval — it's not "posting" and doesn't need the approval gate.
 */
@RestController
public class MeController {

    private final CurrentUserService currentUserService;
    private final AppUserRepository appUserRepository;

    public MeController(CurrentUserService currentUserService, AppUserRepository appUserRepository) {
        this.currentUserService = currentUserService;
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/api/me")
    public MeResponse me(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        return MeResponse.from(user);
    }

    @PatchMapping("/api/me")
    public MeResponse updateMe(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        AppUser user = currentUserService.resolve(authentication);
        if (request.badge() != null) user.setBadge(blankToNull(request.badge()));
        if (request.bio() != null) user.setBio(blankToNull(request.bio()));
        if (request.specialties() != null) user.setSpecialties(blankToNull(request.specialties()));
        return MeResponse.from(appUserRepository.save(user));
    }

    /**
     * Submits (or resubmits) a license number + state for admin review. Always
     * moves credentialStatus to PENDING_REVIEW, including a resubmission after
     * REJECTED — there's no separate "appeal" flow in the POC.
     */
    @PatchMapping("/api/me/credential")
    public MeResponse submitCredential(Authentication authentication, @Valid @RequestBody SubmitCredentialRequest request) {
        AppUser user = currentUserService.resolve(authentication);
        user.setLicenseNumber(request.licenseNumber().trim());
        user.setLicenseState(request.licenseState().trim());
        user.setCredentialStatus(CredentialStatus.PENDING_REVIEW);
        return MeResponse.from(appUserRepository.save(user));
    }

    private String blankToNull(String value) {
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
