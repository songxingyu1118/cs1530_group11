package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

public class EncryptedResponseDto {
    @Schema(description = "AES-GCM encrypted response payload")
    private String encryptedData;

    public EncryptedResponseDto(String encryptedData) {
        this.encryptedData = encryptedData;
    }

    public String getEncryptedData() {
        return encryptedData;
    }

    public void setEncryptedData(String encryptedData) {
        this.encryptedData = encryptedData;
    }
}