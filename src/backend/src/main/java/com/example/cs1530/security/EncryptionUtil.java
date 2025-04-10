package com.example.cs1530.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class EncryptionUtil {
    private static final Logger logger = LoggerFactory.getLogger(EncryptionUtil.class);

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128; 

    // Simple boolean to control logging
    private static boolean logEnabled = true;

    /**
     * Derives an AES key from the ECDH shared secret using SHA-256
     */
    public SecretKey deriveKey(String sharedSecret) {
        try {
            byte[] sharedSecretBytes = Base64.getDecoder().decode(sharedSecret);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(sharedSecretBytes);
            return new SecretKeySpec(keyBytes, "AES");
        } catch (Exception e) {
            logger.error("Error deriving key: {}", e.getMessage());
            throw new RuntimeException("Error deriving encryption key", e);
        }
    }

    /**
     * Encrypts data using AES-GCM with the derived key
     */
    public String encrypt(String data, SecretKey key) {
        try {
            if (logEnabled) {
                logger.info("Encrypting data (plaintext): {}", data);
            }

            byte[] dataBytes = data.getBytes("UTF-8");

            // Generate random IV
            SecureRandom random = new SecureRandom();
            byte[] iv = new byte[GCM_IV_LENGTH];
            random.nextBytes(iv);

            // Initialize cipher for encryption
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, gcmSpec);

            // Encrypt
            byte[] encryptedData = cipher.doFinal(dataBytes);

            // Concatenate IV and encrypted data
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedData.length);
            byteBuffer.put(iv);
            byteBuffer.put(encryptedData);

            String result = Base64.getEncoder().encodeToString(byteBuffer.array());

            if (logEnabled) {
                logger.info("Encrypted data (ciphertext): {}", result);
            }

            return result;
        } catch (Exception e) {
            logger.error("Error encrypting data: {}", e.getMessage());
            throw new RuntimeException("Error encrypting data", e);
        }
    }

    /**
     * Decrypts data using AES-GCM with the derived key
     */
    public String decrypt(String encryptedData, SecretKey key) {
        try {
            if (logEnabled) {
                logger.info("Decrypting data (ciphertext): {}", encryptedData);
            }

            byte[] encryptedBytes = Base64.getDecoder().decode(encryptedData);

            // Extract IV
            ByteBuffer byteBuffer = ByteBuffer.wrap(encryptedBytes);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);

            // Extract cipher text
            byte[] cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);

            // Initialize cipher for decryption
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, gcmSpec);

            // Decrypt
            byte[] decryptedData = cipher.doFinal(cipherText);
            String result = new String(decryptedData, "UTF-8");

            if (logEnabled) {
                logger.info("Decrypted data (plaintext): {}", result);
            }

            return result;
        } catch (Exception e) {
            logger.error("Error decrypting data: {}", e.getMessage());
            throw new RuntimeException("Error decrypting data", e);
        }
    }

    /**
     * Enable or disable encryption logging
     */
    public static void setLogEnabled(boolean enabled) {
        logEnabled = enabled;
        logger.info("Encryption logging is now {}", enabled ? "enabled" : "disabled");
    }

    /**
     * Check if encryption logging is enabled
     */
    public static boolean isLogEnabled() {
        return logEnabled;
    }
}