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

    // Initiate handshake with server
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

    // Export client's public key
    const clientPublicKeyBytes = await crypto.exportKey('spki', keyPair.publicKey);
    const clientPublicKeyBase64 = arrayBufferToBase64(clientPublicKeyBytes);

    // Complete handshake with server
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

    // Derive shared secret
    const sharedSecret = await crypto.deriveBits(
      {
        name: 'ECDH',
        public: serverPublicKey,
      },
      keyPair.privateKey,
      256
    );

    // Initialize AES key
    const aesKey = await initializeAESKey(sharedSecret);

    // Set up the security context
    securityContext.sessionId = sessionId;
    securityContext.aesKey = aesKey;
    securityContext.initialized = true;

    console.log('ECDH key exchange completed successfully!');
    return true;
  } catch (error) {
    console.error('ECDH key exchange failed:', error);
    return false;
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

  // Generate random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

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

  // Combine IV and encrypted data
  const result = new Uint8Array(iv.byteLength + encryptedData.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encryptedData), iv.byteLength);

  // Convert to Base64
  return arrayBufferToBase64(result);
};

/**
 * Decrypt data using AES-GCM
 */
export const decrypt = async (encryptedData) => {
  if (!securityContext.initialized) {
    throw new Error('Security not initialized. Run initializeECDH() first.');
  }

  // Decode Base64
  const encryptedBytes = base64ToArrayBuffer(encryptedData);

  // Extract IV (first 12 bytes)
  const iv = encryptedBytes.slice(0, 12);

  // Extract ciphertext
  const ciphertext = encryptedBytes.slice(12);

  // Decrypt data
  const decryptedData = await crypto.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    securityContext.aesKey,
    ciphertext
  );

  // Convert to string
  return new TextDecoder().decode(decryptedData);
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
        'Content-Type': 'text/plain',
        'X-Session-ID': getSessionId()
      },
      body: encryptedData
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