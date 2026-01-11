package com.fitness.userservice.controllers;

import com.fitness.userservice.DTO.UserRequest;
import com.fitness.userservice.DTO.UserResponse;
import com.fitness.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;


    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request){
        return ResponseEntity.ok(userService.register(request));
    }

}
