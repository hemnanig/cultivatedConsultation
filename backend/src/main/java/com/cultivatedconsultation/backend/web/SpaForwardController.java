package com.cultivatedconsultation.backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Only needed because backend and frontend are deployed as one combined service
 * (see backend/Dockerfile): Spring Boot serves the built React app as static
 * resources, but a hard browser navigation to a client-side route that isn't a
 * real static file — like Google's OAuth redirect landing on /auth/callback —
 * would otherwise 404 instead of reaching React Router.
 *
 * "/" doesn't need an explicit entry: Spring Boot already serves static/index.html
 * there automatically as the default welcome page.
 */
@Controller
public class SpaForwardController {

    @GetMapping("/auth/callback")
    public String authCallback() {
        return "forward:/index.html";
    }
}
