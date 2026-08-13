package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.PublicMemberResponse;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Unauthenticated, opt-in public directory (brief section 4.6). No login
 * required — see SecurityConfig's permitAll for /api/public/**. Only members
 * who explicitly flipped publicDirectoryOptIn show up here, and only the
 * fields already visible in the internal member directory are exposed (see
 * PublicMemberResponse) — never license number, email, or anything else
 * private.
 */
@RestController
@RequestMapping("/api/public/directory")
public class PublicDirectoryController {

    private final AppUserRepository appUserRepository;

    public PublicDirectoryController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping
    public List<PublicMemberResponse> list() {
        return appUserRepository.findByPublicDirectoryOptInTrueAndMembershipStatusOrderByNameAsc(MembershipStatus.APPROVED)
                .stream()
                .map(PublicMemberResponse::from)
                .toList();
    }
}
