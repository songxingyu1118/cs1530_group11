package com.example.cs1530.security;

import org.springframework.stereotype.Service;
import javax.crypto.KeyAgreement;
import java.security.*;
import java.security.spec.*;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//Service for ECDH handshake and AES GCM encption
@Service
public class ECDHService {
    private final Logger logger = LoggerFactory.getLogger(ECDHService.class);
    private final Map<String, KeyPair> sessionKeyPairs = new HashMap<>();
    private static final String ALGORITHM = "EC";
    private static final String CURVE = "secp256r1"; // NIST P-256 curve
    private static final String KEY_AGREEMENT_ALGORITHM = "ECDH";

    /**
     * Generates a new key pair for a session and returns the public key.
     *
     * @param sessionId Unique session identifier
     * @return Base64 encoded public key
     */
    public String generateKeyPair(String sessionId) {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ALGORITHM);
            ECGenParameterSpec ecSpec = new ECGenParameterSpec(CURVE);
            keyPairGenerator.initialize(ecSpec, new SecureRandom());

            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            sessionKeyPairs.put(sessionId, keyPair);

            byte[] publicKeyBytes = keyPair.getPublic().getEncoded();
            return Base64.getEncoder().encodeToString(publicKeyBytes);
        } catch (Exception e) {
            logger.error("Error generating key pair: {}", e.getMessage());
            throw new RuntimeException("Error generating ECDH key pair", e);
        }
    }

    /**
     * Computes the shared secret using the client's public key and server's private key.
     *
     * @param sessionId Unique session identifier
     * @param clientPublicKeyBase64 Client's base64 encoded public key
     * @return Base64 encoded shared secret
     */
    public String computeSharedSecret(String sessionId, String clientPublicKeyBase64) {
        try {
            KeyPair serverKeyPair = sessionKeyPairs.get(sessionId);
            if (serverKeyPair == null) {
                throw new IllegalStateException("No key pair found for session: " + sessionId);
            }

            // Decode client's public key
            byte[] clientPublicKeyBytes = Base64.getDecoder().decode(clientPublicKeyBase64);
            KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(clientPublicKeyBytes);
            PublicKey clientPublicKey = keyFactory.generatePublic(keySpec);

            // Perform key agreement
            KeyAgreement keyAgreement = KeyAgreement.getInstance(KEY_AGREEMENT_ALGORITHM);
            keyAgreement.init(serverKeyPair.getPrivate());
            keyAgreement.doPhase(clientPublicKey, true);

            // Generate shared secret
            byte[] sharedSecret = keyAgreement.generateSecret();
            return Base64.getEncoder().encodeToString(sharedSecret);
        } catch (Exception e) {
            logger.error("Error computing shared secret: {}", e.getMessage());
            throw new RuntimeException("Error in ECDH key agreement", e);
        }
    }

    /**
     * Validates if a session has an existing key pair.
     *
     * @param sessionId Unique session identifier
     * @return true if session key pair exists
     */
    public boolean hasKeyPair(String sessionId) {
        return sessionKeyPairs.containsKey(sessionId);
    }

    /**
     * Removes key pair for a session during cleanup.
     *
     * @param sessionId Unique session identifier
     */
    public void removeKeyPair(String sessionId) {
        sessionKeyPairs.remove(sessionId);
    }
}