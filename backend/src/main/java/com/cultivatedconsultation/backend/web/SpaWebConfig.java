package com.cultivatedconsultation.backend.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Only needed because backend and frontend are deployed as one combined service
 * (see Dockerfile at the repo root): Spring Boot serves the built React app as
 * static resources under classpath:/static, but a hard browser navigation or
 * refresh on a client-side route — /directory, /groups/12, /faq, whatever React
 * Router owns — isn't a real static file. Without this, Spring's default
 * resource handling 404s (the Whitelabel error page) instead of reaching React
 * Router, because there's no static/directory file and no @RestController
 * mapped to that path.
 *
 * This replaces the old SpaForwardController, which only special-cased
 * /auth/callback and would have needed a new @GetMapping added by hand every
 * time a route was added to the frontend (faq, contact, privacy-policy... it
 * was already out of date). Instead: any request that isn't an actual static
 * asset and isn't under /api falls back to index.html, so React Router always
 * gets a chance to render the right screen client-side.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Let /api/** requests 404 normally if nothing else claims them —
                        // don't mask a missing/misspelled endpoint as the SPA shell.
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
