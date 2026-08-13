package com.cultivatedconsultation.backend.service;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Notification;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

/**
 * Thin helper injected into whichever controller triggers a notification
 * (new reply, membership decision, group add, new message, credential
 * decision). Deliberately fire-and-forget — a failure here shouldn't fail
 * the action that triggered it, so callers just call notify() and move on.
 */
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void notify(AppUser recipient, NotificationType type, String message, String linkPath) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLinkPath(linkPath);
        notificationRepository.save(notification);
    }
}
