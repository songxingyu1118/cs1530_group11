const crypto = window.crypto.subtle;

// Security context to store session state
const securityContext = {
  sessionId: null,
  aesKey: null,
  initialized: false
};

// Utility functions for Base64 conversion
export const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Initialize ECDH key exchange
 */
export const initializeECDH = async () => {
  try {
    // Check if already initialized
    if (securityContext.initialized) {
      console.log('ECDH already initialized, session ID:', securityContext.sessionId);
      return true;
    }

    console.log('Starting ECDH key exchange...');

    // Generate client key pair
    const keyPair = await crypto.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      ['deriveKey', 'deriveBits']
    );
    console.log('Client keypair generated successfully');

    // Initiate handshake with server
    console.log('Sending handshake initiation request to server...');
    const initiateResponse = await fetch('/api/ecdh/initiate', {
      method: 'POST'
    });

    if (!initiateResponse.ok) {
      throw new Error(`Server handshake initiation failed: ${initiateResponse.status}`);
    }

    const data = await initiateResponse.json();
    const sessionId = data.sessionId;
    const serverPublicKeyBase64 = data.serverPublicKey;

    console.log(`Received session ID: ${sessionId}`);
    console.log('Received server public key (base64 encoded)');

    // Import server's public key
    const serverPublicKeyBytes = base64ToArrayBuffer(serverPublicKeyBase64);
    const serverPublicKey = await crypto.importKey(
      'spki',
      serverPublicKeyBytes,
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      []
    );
    console.log('Imported server public key successfully');

    // Export client's public key
    const clientPublicKeyBytes = await crypto.exportKey('spki', keyPair.publicKey);
    const clientPublicKeyBase64 = arrayBufferToBase64(clientPublicKeyBytes);
    console.log('Exported client public key successfully');

    // Complete handshake with server
    console.log('Sending handshake completion request to server...');
    const completeResponse = await fetch('/api/ecdh/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        clientPublicKey: clientPublicKeyBase64,
      }),
    });

    if (!completeResponse.ok) {
      throw new Error(`Handshake completion failed: ${completeResponse.status}`);
    }
    console.log('Server confirmed handshake completion');

    // Derive shared secret
    console.log('Deriving shared secret...');
    const sharedSecret = await crypto.deriveBits(
      {
        name: 'ECDH',
        public: serverPublicKey,
      },
      keyPair.privateKey,
      256
    );
    console.log('Shared secret derived successfully');

    // Initialize AES key
    console.log('Initializing AES key from shared secret...');
    const aesKey = await initializeAESKey(sharedSecret);
    console.log('AES key initialized successfully');

    // Set up the security context
    securityContext.sessionId = sessionId;
    securityContext.aesKey = aesKey;
    securityContext.initialized = true;

    console.log('ECDH key exchange completed successfully! Session ID:', sessionId);
    return true;
  } catch (error) {
    console.error('ECDH key exchange failed:', error);
    // Reset context on failure
    securityContext.sessionId = null;
    securityContext.aesKey = null;
    securityContext.initialized = false;
    throw error;
  }
};

/**
 * Initialize AES key from the shared secret
 */
const initializeAESKey = async (sharedSecret) => {
  // Compute SHA-256 hash of the shared secret to match the server's key derivation
  const hashBuffer = await crypto.digest('SHA-256', sharedSecret);

  // Import the hashed shared secret as an AES-GCM key
  return await crypto.importKey(
    'raw',
    hashBuffer,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt data using AES-GCM
 */
export const encrypt = async (data) => {
  if (!securityContext.initialized) {
    throw new Error('Security not initialized. Run initializeECDH() first.');
  }

  try {
    console.log('Encrypting data with AES-GCM...');

    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log('Generated random IV');

    // Encrypt data
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await crypto.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      securityContext.aesKey,
      encodedData
    );
    console.log('Data encrypted successfully');

    // Combine IV and encrypted data
    const result = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedData), iv.byteLength);
    console.log('Combined IV and encrypted data');

    // Convert to Base64
    const base64Result = arrayBufferToBase64(result);
    console.log('Encrypted data converted to Base64');

    return base64Result;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

/**
 * Decrypt data using AES-GCM
 */
export const decrypt = async (encryptedData) => {
  if (!securityContext.initialized) {
    throw new Error('Security not initialized. Run initializeECDH() first.');
  }

  try {
    console.log('Decrypting data with AES-GCM...');

    // Decode Base64
    const encryptedBytes = base64ToArrayBuffer(encryptedData);
    console.log('Decoded Base64 encrypted data');

    // Extract IV (first 12 bytes)
    const iv = encryptedBytes.slice(0, 12);
    console.log('Extracted IV from encrypted data');

    // Extract ciphertext
    const ciphertext = encryptedBytes.slice(12);
    console.log('Extracted ciphertext from encrypted data');

    // Decrypt data
    const decryptedData = await crypto.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      securityContext.aesKey,
      ciphertext
    );
    console.log('Data decrypted successfully');

    // Convert to string
    const result = new TextDecoder().decode(decryptedData);
    console.log('Decrypted data converted to string');

    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

/**
 * Get the current session ID
 */
export const getSessionId = () => {
  return securityContext.sessionId;
};

/**
 * Check if security is initialized
 */
export const isInitialized = () => {
  return securityContext.initialized;
};

/**
 * Make an encrypted API call
 */
export const secureApiCall = async (url, method, data) => {
  if (!isInitialized()) {
    throw new Error('Security not initialized. Run initializeECDH() first.');
  }

  try {
    // Encrypt the request data
    const encryptedData = await encrypt(JSON.stringify(data));

    // Make the request with the session ID header
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: getSessionId(),
        encryptedCredentials: encryptedData
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    // Get the encrypted response
    const encryptedResponse = await response.text();

    // Decrypt the response
    const decryptedResponse = await decrypt(encryptedResponse);

    // Parse and return the response
    return JSON.parse(decryptedResponse);
  } catch (error) {
    console.error('Secure API call failed:', error);
    throw error;
  }
};