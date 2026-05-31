package com.example.dinowiki.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping({"/", ""})
    public String index() {
        // forward to index.html served by the ResourceHandler (frontend folder)
        return "forward:/index.html";
    }
}

