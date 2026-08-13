package com.cultivatedconsultation.backend.model;

/**
 * Real credential *verification* (vs. the free-text `badge` field, which is
 * still just self-reported). A member submits a license number + state; an
 * admin reviews it out-of-band (calling the licensing board, etc. — outside
 * this app) and marks it verified or rejected.
 */
public enum CredentialStatus {
    UNVERIFIED,
    PENDING_REVIEW,
    VERIFIED,
    REJECTED
}
