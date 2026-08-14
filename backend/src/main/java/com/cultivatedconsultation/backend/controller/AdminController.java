package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.MeResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.CredentialStatus;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * POC stand-in for the real verification console described in the product brief
 * (section 4.7). Just enough to unblock testers: list pending users, approve/deny one.
 * Gated on AppUser.admin, set via app.admin-emails on first login.
 */
@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    private final AppUserRepository appUserRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public AdminController(AppUserRepository appUserRepository, CurrentUserService currentUserService,
                            NotificationService notificationService) {
        this.appUserRepository = appUserRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @GetMapping("/pending")
    public List<MeResponse> pending(Authentication authentication) {
        requireAdmin(authentication);
        return appUserRepository.findAll().stream()
                .filter(u -> u.getMembershipStatus() == MembershipStatus.PENDING)
                .map(MeResponse::from)
                .toList();
    }

    @GetMapping
    public List<MeResponse> approvedMembers(Authentication authentication) {
        requireAdmin(authentication);
        return appUserRepository.findAll().stream()
                .filter(u -> u.getMembershipStatus() == MembershipStatus.APPROVED)
                .map(MeResponse::from)
                .toList();
    }

    @PostMapping("/{userId}/promote")
    public MeResponse promote(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setAdmin(true);
        return MeResponse.from(appUserRepository.save(user));
    }

    @PostMapping("/{userId}/approve")
    public MeResponse approve(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setMembershipStatus(MembershipStatus.APPROVED);
        MeResponse response = MeResponse.from(appUserRepository.save(user));
        notificationService.notify(user, NotificationType.MEMBERSHIP_APPROVED,
                "Your account was approved — welcome to the community", "/");
        return response;
    }

    @PostMapping("/{userId}/deny")
    public MeResponse deny(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setMembershipStatus(MembershipStatus.DENIED);
        MeResponse response = MeResponse.from(appUserRepository.save(user));
        notificationService.notify(user, NotificationType.MEMBERSHIP_DENIED,
                "Your application was not approved", null);
        return response;
    }

    @GetMapping("/credentials/pending")
    public List<MeResponse> pendingCredentials(Authentication authentication) {
        requireAdmin(authentication);
        return appUserRepository.findByCredentialStatusOrderByNameAsc(CredentialStatus.PENDING_REVIEW).stream()
                .map(MeResponse::from)
                .toList();
    }

    @PostMapping("/{userId}/credential/verify")
    public MeResponse verifyCredential(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setCredentialStatus(CredentialStatus.VERIFIED);
        MeResponse response = MeResponse.from(appUserRepository.save(user));
        notificationService.notify(user, NotificationType.CREDENTIAL_VERIFIED,
                "Your credential was verified", "/profile");
        return response;
    }

    @PostMapping("/{userId}/credential/reject")
    public MeResponse rejectCredential(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setCredentialStatus(CredentialStatus.REJECTED);
        MeResponse response = MeResponse.from(appUserRepository.save(user));
        notificationService.notify(user, NotificationType.CREDENTIAL_REJECTED,
                "Your credential submission was not verified", "/profile");
        return response;
    }

    private AppUser find(Long userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void requireAdmin(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (!user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
        }
    }
}
