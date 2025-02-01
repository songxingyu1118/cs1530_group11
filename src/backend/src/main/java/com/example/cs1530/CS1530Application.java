package com.example.cs1530;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CS1530Application {
    public static void main(String[] args) {
        SpringApplication.run(CS1530Application.class, args);
    }
}