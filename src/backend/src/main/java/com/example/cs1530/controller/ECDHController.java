package com.example.cs1530.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cs1530.dto.Auth.HandshakeRequest;
import com.example.cs1530.dto.Auth.HandshakeResponse;
import com.example.cs1530.security.SecurityManager;

import java.util.UUID;

@RestController
@RequestMapping("/api/ecdh")
@CrossOrigin(origins = "*")
public class ECDHController {
    private static final Logger logger = LoggerFactory.getLogger(ECDHController.class);

    @Autowired
    private SecurityManager securityManager;

    /**
     * Initiates a secure handshake by generating a session ID and server public key.
     * The client will use this public key to establish a shared secret.
     */
    @PostMapping("/initiate")
    public ResponseEntity<HandshakeResponse> initiateHandshake() {
        String sessionId = UUID.randomUUID().toString();
        String serverPublicKey = securityManager.initiateHandshake(sessionId);

        HandshakeResponse response = new HandshakeResponse();
        response.setSessionId(sessionId);
        response.setServerPublicKey(serverPublicKey);

        logger.info("Handshake initiated for session: {}", sessionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Completes the handshake by receiving the client's public key
     * and establishing a shared secret for the session.
     */
    @PostMapping("/complete")
    public ResponseEntity<Void> completeHandshake(@RequestBody HandshakeRequest request) {
        securityManager.completeHandshake(request.getSessionId(), request.getClientPublicKey());
        logger.info("Handshake completed for session: {}", request.getSessionId());
        return ResponseEntity.ok().build();
    }

    /**
     * Terminate a secure session.
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> terminateSession(@PathVariable String sessionId) {
        securityManager.removeSession(sessionId);
        logger.info("Session terminated: {}", sessionId);
        return ResponseEntity.ok().build();
    }
}