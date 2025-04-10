package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

public class EncryptedLoginRequest {
    @Schema(description = "Session identifier from the handshake")
    private String sessionId;

    @Schema(description = "AES-GCM encrypted email and password")
    private String encryptedCredentials;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getEncryptedCredentials() {
        return encryptedCredentials;
    }

    public void setEncryptedCredentials(String encryptedCredentials) {
        this.encryptedCredentials = encryptedCredentials;
    }
}