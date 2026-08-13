package com.cultivatedconsultation.backend.service;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.PushSubscription;
import com.cultivatedconsultation.backend.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.List;

/**
 * Sends real Web Push notifications (works even when the tab/app isn't open)
 * via VAPID, per RFC 8291/8292. This is the one piece of the app this
 * sandbox could not compile or test end-to-end — no Maven, no browser, no
 * live HTTPS origin to actually receive a push here. Verify with a real
 * build and a real deploy before relying on it.
 *
 * Fire-and-forget by design, same contract as NotificationService.notify:
 * a push failure (expired subscription, misconfigured VAPID keys, network
 * blip) must never fail the action that triggered the notification.
 */
@Service
public class PushNotificationService {

    private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private PushService pushService;

    public PushNotificationService(PushSubscriptionRepository pushSubscriptionRepository,
                                    @Value("${app.vapid.public-key:}") String vapidPublicKey,
                                    @Value("${app.vapid.private-key:}") String vapidPrivateKey,
                                    @Value("${app.vapid.subject:mailto:admin@cultivatedconsultation.com}") String vapidSubject) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;

        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        if (vapidPublicKey == null || vapidPublicKey.isBlank() || vapidPrivateKey == null || vapidPrivateKey.isBlank()) {
            log.warn("VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY not set — push notifications are disabled. " +
                    "In-app notifications still work normally.");
            return;
        }

        try {
            this.pushService = new PushService(vapidPublicKey, vapidPrivateKey, vapidSubject);
        } catch (Exception e) {
            log.warn("Failed to initialize web-push with the configured VAPID keys — push notifications " +
                    "are disabled. Double-check VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY. Cause: {}", e.getMessage());
        }
    }

    /** No-op if push isn't configured (see constructor) — always safe to call. */
    public void sendToUser(AppUser user, String title, String body, String url) {
        if (pushService == null) return;

        List<PushSubscription> subscriptions = pushSubscriptionRepository.findByUser(user);
        if (subscriptions.isEmpty()) return;

        String payload = "{\"title\":\"" + escape(title) + "\",\"body\":\"" + escape(body) + "\",\"url\":\"" + escape(url) + "\"}";

        for (PushSubscription sub : subscriptions) {
            try {
                Subscription subscription = new Subscription(
                        sub.getEndpoint(),
                        new Subscription.Keys(sub.getP256dhKey(), sub.getAuthKey())
                );
                nl.martijndwars.webpush.Notification notification =
                        new nl.martijndwars.webpush.Notification(subscription, payload);
                HttpResponse response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();
                // 404/410 means the browser dropped this subscription (uninstalled, cleared
                // storage, etc.) — the push service is telling us it'll never work again.
                if (status == 404 || status == 410) {
                    pushSubscriptionRepository.delete(sub);
                }
            } catch (Exception e) {
                log.warn("Push send failed for subscription {}: {}", sub.getId(), e.getMessage());
            }
        }
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
