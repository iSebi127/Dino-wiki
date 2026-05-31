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
        // serve images mounted into the container from project root ./images (development override)
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./images/");

        // NOTE: removed the catch-all file-based /** resource handler so that Spring Boot's
        // default static resource handling (classpath:/static/) serves embedded frontend files
        // when the app is packaged in the JAR. Having the file-based /** mapping could
        // intercept requests and return 404 inside containers where frontend/dist isn't available
        // on the filesystem.
    }
}
