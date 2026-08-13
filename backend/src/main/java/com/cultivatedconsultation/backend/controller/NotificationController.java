package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.NotificationResponse;
import com.cultivatedconsultation.backend.dto.Dtos.UnreadCountResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Notification;
import com.cultivatedconsultation.backend.repository.NotificationRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

/**
 * Not gated on approval status (like MeController) — a pending user could in
 * principle already have a MEMBERSHIP_APPROVED/DENIED notification waiting
 * for them the moment they're allowed to see the app.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    public NotificationController(NotificationRepository notificationRepository, CurrentUserService currentUserService) {
        this.notificationRepository = notificationRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<NotificationResponse> list(Authentication authentication) {
        AppUser me = currentUserService.resolve(authentication);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(me).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse unreadCount(Authentication authentication) {
        AppUser me = currentUserService.resolve(authentication);
        return new UnreadCountResponse(notificationRepository.countByRecipientAndReadAtIsNull(me));
    }

    @PostMapping("/{id}/read")
    public NotificationResponse markRead(Authentication authentication, @PathVariable Long id) {
        AppUser me = currentUserService.resolve(authentication);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!notification.getRecipient().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
        }
        if (notification.getReadAt() == null) {
            notification.setReadAt(Instant.now());
            notification = notificationRepository.save(notification);
        }
        return NotificationResponse.from(notification);
    }

    @PostMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllRead(Authentication authentication) {
        AppUser me = currentUserService.resolve(authentication);
        List<Notification> unread = notificationRepository.findByRecipientAndReadAtIsNull(me);
        Instant now = Instant.now();
        unread.forEach(n -> n.setReadAt(now));
        notificationRepository.saveAll(unread);
    }
}
