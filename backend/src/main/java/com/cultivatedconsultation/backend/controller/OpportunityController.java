package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.CreateOpportunityRequest;
import com.cultivatedconsultation.backend.dto.Dtos.OpportunityResponse;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Opportunity;
import com.cultivatedconsultation.backend.repository.OpportunityRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Opportunities & Offerings board (brief section 3.6) — job postings,
 * research-participant recruitment, and supervision/training offers.
 * Deliberately separate from the consultation feed/Post entity so clinical
 * discussion doesn't get crowded by advertising. No replies/threads here;
 * interested members use the existing direct-message feature to reach out
 * to the poster.
 */
@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;
    private final CurrentUserService currentUserService;

    public OpportunityController(OpportunityRepository opportunityRepository, CurrentUserService currentUserService) {
        this.opportunityRepository = opportunityRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<OpportunityResponse> list(Authentication authentication) {
        requireApproved(authentication);
        return opportunityRepository.findAllWithAuthorOrderByCreatedAtDesc().stream()
                .map(OpportunityResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OpportunityResponse create(Authentication authentication, @Valid @RequestBody CreateOpportunityRequest request) {
        AppUser author = requireApproved(authentication);
        Opportunity opportunity = new Opportunity();
        opportunity.setAuthor(author);
        opportunity.setType(request.type());
        opportunity.setTitle(request.title());
        opportunity.setDescription(request.description());
        return OpportunityResponse.from(opportunityRepository.save(opportunity));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        AppUser me = requireApproved(authentication);
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opportunity not found"));
        if (!opportunity.getAuthor().getId().equals(me.getId()) && !me.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the poster or an admin can remove this");
        }
        opportunityRepository.delete(opportunity);
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }
}
