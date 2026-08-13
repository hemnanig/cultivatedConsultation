package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.PushSubscriptionRequest;
import com.cultivatedconsultation.backend.dto.Dtos.UnsubscribePushRequest;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.PushSubscription;
import com.cultivatedconsultation.backend.repository.PushSubscriptionRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Not gated on approval status — a pending user should still be able to opt
 * into push so they find out the moment they're approved, same reasoning as
 * MeController's profile edits.
 */
@RestController
@RequestMapping("/api/push")
public class PushSubscriptionController {

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final CurrentUserService currentUserService;
    private final String vapidPublicKey;

    public PushSubscriptionController(PushSubscriptionRepository pushSubscriptionRepository,
                                       CurrentUserService currentUserService,
                                       @Value("${app.vapid.public-key:}") String vapidPublicKey) {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        this.currentUserService = currentUserService;
        this.vapidPublicKey = vapidPublicKey;
    }

    /**
     * Empty string if VAPID isn't configured — frontend just skips offering push in that
     * case. Trimmed defensively: a trailing newline/space in the env var (easy to introduce
     * pasting into Render's dashboard) is invisible here but breaks base64url decoding in
     * the browser with a cryptic exception that gives no hint why.
     */
    @GetMapping("/vapid-public-key")
    public Map<String, String> vapidPublicKey() {
        return Map.of("publicKey", vapidPublicKey == null ? "" : vapidPublicKey.trim());
    }

    @PostMapping("/subscriptions")
    @ResponseStatus(HttpStatus.CREATED)
    public void subscribe(Authentication authentication, @Valid @RequestBody PushSubscriptionRequest request) {
        AppUser me = currentUserService.resolve(authentication);
        PushSubscription subscription = pushSubscriptionRepository.findByEndpoint(request.endpoint())
                .orElseGet(PushSubscription::new);
        subscription.setUser(me);
        subscription.setEndpoint(request.endpoint());
        subscription.setP256dhKey(request.p256dhKey());
        subscription.setAuthKey(request.authKey());
        pushSubscriptionRepository.save(subscription);
    }

    @PostMapping("/unsubscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribe(Authentication authentication, @Valid @RequestBody UnsubscribePushRequest request) {
        currentUserService.resolve(authentication);
        pushSubscriptionRepository.deleteByEndpoint(request.endpoint());
    }
}
