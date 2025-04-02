package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

public class HandshakeResponse {
    @Schema(description = "Unique session identifier for secure communication")
    private String sessionId;

    @Schema(description = "Base64 encoded server public key for ECDH key exchange")
    private String serverPublicKey;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getServerPublicKey() {
        return serverPublicKey;
    }

    public void setServerPublicKey(String serverPublicKey) {
        this.serverPublicKey = serverPublicKey;
    }
}
