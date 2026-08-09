package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.MeResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
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

    public AdminController(AppUserRepository appUserRepository, CurrentUserService currentUserService) {
        this.appUserRepository = appUserRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/pending")
    public List<MeResponse> pending(Authentication authentication) {
        requireAdmin(authentication);
        return appUserRepository.findAll().stream()
                .filter(u -> u.getMembershipStatus() == MembershipStatus.PENDING)
                .map(MeResponse::from)
                .toList();
    }

    @PostMapping("/{userId}/approve")
    public MeResponse approve(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setMembershipStatus(MembershipStatus.APPROVED);
        return MeResponse.from(appUserRepository.save(user));
    }

    @PostMapping("/{userId}/deny")
    public MeResponse deny(Authentication authentication, @PathVariable Long userId) {
        requireAdmin(authentication);
        AppUser user = find(userId);
        user.setMembershipStatus(MembershipStatus.DENIED);
        return MeResponse.from(appUserRepository.save(user));
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
