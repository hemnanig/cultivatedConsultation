package com.cultivatedconsultation.backend.service;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Notification;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;

/**
 * Thin helper injected into whichever controller triggers a notification
 * (new reply, membership decision, group add, new message, credential
 * decision, announcement). Deliberately fire-and-forget — a failure here
 * shouldn't fail the action that triggered it, so callers just call notify()
 * and move on. Every in-app notification also attempts a web push (silently
 * a no-op if the recipient has no subscriptions or push isn't configured —
 * see PushNotificationService) so it reaches people even when the tab isn't open.
 */
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final PushNotificationService pushNotificationService;

    public NotificationService(NotificationRepository notificationRepository,
                                PushNotificationService pushNotificationService) {
        this.notificationRepository = notificationRepository;
        this.pushNotificationService = pushNotificationService;
    }

    public void notify(AppUser recipient, NotificationType type, String message, String linkPath) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLinkPath(linkPath);
        notificationRepository.save(notification);

        pushNotificationService.sendToUser(recipient, "Cultivated Consultation", message,
                linkPath != null ? linkPath : "/");
    }
}
