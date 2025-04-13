package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

public class EncryptedRequestDto {
    @Schema(description = "Session identifier from the ECDH handshake")
    private String sessionId;

    @Schema(description = "AES-GCM encrypted payload")
    private String encryptedData;

    // Getters and setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getEncryptedData() {
        return encryptedData;
    }

    public void setEncryptedData(String encryptedData) {
        this.encryptedData = encryptedData;
    }
}