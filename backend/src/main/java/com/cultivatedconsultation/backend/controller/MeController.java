package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.MeResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Deliberately NOT gated on approval status — the frontend needs to be able to
 * ask "who am I and what's my status" in order to decide whether to show the
 * pending screen or the feed.
 */
@RestController
public class MeController {

    private final CurrentUserService currentUserService;

    public MeController(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    @GetMapping("/api/me")
    public MeResponse me(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        return MeResponse.from(user);
    }
}
