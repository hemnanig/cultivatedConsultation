package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.AnnouncementResponse;
import com.cultivatedconsultation.backend.dto.Dtos.CreateAnnouncementRequest;
import com.cultivatedconsultation.backend.model.Announcement;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.repository.AnnouncementRepository;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Admin-authored, community-wide broadcasts. POC-scoped version of the
 * brief's announcement system (section 4.1) — publish-now only, no
 * scheduling, drafts, audience segmentation, or delivery metrics. Every
 * approved member (other than the sender) gets an in-app + push
 * notification; the most recent announcement also pins to the top of the
 * public feed on the frontend.
 */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final AppUserRepository appUserRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public AnnouncementController(AnnouncementRepository announcementRepository, AppUserRepository appUserRepository,
                                   CurrentUserService currentUserService, NotificationService notificationService) {
        this.announcementRepository = announcementRepository;
        this.appUserRepository = appUserRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    /** Most recent 5 — enough to pin the latest and let admins see recent history. */
    @GetMapping
    public List<AnnouncementResponse> list(Authentication authentication) {
        requireApproved(authentication);
        return announcementRepository.findAllWithCreatedByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(AnnouncementResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AnnouncementResponse create(Authentication authentication, @Valid @RequestBody CreateAnnouncementRequest request) {
        AppUser admin = requireAdmin(authentication);

        Announcement announcement = new Announcement();
        announcement.setCreatedBy(admin);
        announcement.setMessage(request.message());
        Announcement saved = announcementRepository.save(announcement);

        appUserRepository.findByMembershipStatusOrderByNameAsc(MembershipStatus.APPROVED).stream()
                .filter(u -> !u.getId().equals(admin.getId()))
                .forEach(u -> notificationService.notify(u, NotificationType.ANNOUNCEMENT, request.message(), "/"));

        return AnnouncementResponse.from(saved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        requireAdmin(authentication);
        if (!announcementRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Announcement not found");
        }
        announcementRepository.deleteById(id);
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }

    private AppUser requireAdmin(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (!user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
        }
        return user;
    }
}
