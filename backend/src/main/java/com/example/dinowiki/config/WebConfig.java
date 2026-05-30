package com.example.dinowiki.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // serve images mounted into the container from project root ./images
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./images/");

        // serve frontend static files from ./frontend/
        registry.addResourceHandler("/css/**", "/js/**", "/index.html", "/favicon.ico")
                .addResourceLocations("file:./frontend/css/", "file:./frontend/js/", "file:./frontend/index.html", "file:./frontend/favicon.ico");

        // fallback: serve any other files from frontend folder
        registry.addResourceHandler("/**")
                .addResourceLocations("file:./frontend/");
    }
}
