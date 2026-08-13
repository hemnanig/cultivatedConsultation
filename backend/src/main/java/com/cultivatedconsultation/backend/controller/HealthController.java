package com.cultivatedconsultation.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Dummy, unauthenticated endpoint (already permitted in SecurityConfig) with a
 * single job: give an external uptime pinger something to hit so Render's free
 * tier doesn't spin the service down after 15 minutes idle. Intentionally does
 * NOT touch the database — this should stay a pure in-process check so pinging
 * it can't itself wake/strain Supabase or slow down under DB load.
 */
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
