package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.MemberResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Locale;

/**
 * Member directory — the "Discover Your Network" feature from the product brief,
 * scaled down to what the POC's flat `specialties` string field can support:
 * list approved members, optionally filtered by a specialty substring match.
 * Only approved members can browse the directory, same gate as the feed.
 */
@RestController
public class MemberController {

    private final AppUserRepository appUserRepository;
    private final CurrentUserService currentUserService;

    public MemberController(AppUserRepository appUserRepository, CurrentUserService currentUserService) {
        this.appUserRepository = appUserRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/api/members")
    public List<MemberResponse> list(Authentication authentication,
                                      @RequestParam(required = false) String specialty) {
        AppUser requester = currentUserService.resolve(authentication);
        if (requester.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }

        List<AppUser> approved = appUserRepository.findByMembershipStatusOrderByNameAsc(MembershipStatus.APPROVED);

        if (specialty != null && !specialty.isBlank()) {
            String needle = specialty.trim().toLowerCase(Locale.ROOT);
            approved = approved.stream()
                    .filter(u -> u.getSpecialties() != null && u.getSpecialties().toLowerCase(Locale.ROOT).contains(needle))
                    .toList();
        }

        return approved.stream().map(MemberResponse::from).toList();
    }
}
