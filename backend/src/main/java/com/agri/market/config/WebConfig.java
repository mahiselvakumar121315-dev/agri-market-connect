package com.agri.market.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirect root URL / to /login.html
        registry.addViewController("/").setViewName("forward:/login.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get absolute path of parent directory
        File rootDir = new File("..").getAbsoluteFile();
        String parentPath = "file:" + rootDir.getAbsolutePath() + "/";

        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/", parentPath)
                .setCachePeriod(0);
    }
}
