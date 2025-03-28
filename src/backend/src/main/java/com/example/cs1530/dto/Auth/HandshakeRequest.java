package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;


public class HandshakeRequest {
    @Schema(description = "Session identifier from the handshake initiation")
    private String sessionId;

    @Schema(description = "Base64 encoded client public key for ECDH key exchange")
    private String clientPublicKey;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getClientPublicKey() {
        return clientPublicKey;
    }

    public void setClientPublicKey(String clientPublicKey) {
        this.clientPublicKey = clientPublicKey;
    }
}