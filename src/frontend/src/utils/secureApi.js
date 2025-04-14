import { encrypt, decrypt, getSessionId, isInitialized, initializeECDH } from '@/security/ecdhclient';

/**
 * Make a secure API call with proper authentication and encryption
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - The data to be sent (will be encrypted)
 * @returns {Promise<Object>} - The decrypted response data
 */
export const secureApiCall = async (url, method, data) => {
  // Ensure security is initialized
  if (!isInitialized()) {
    try {
      await initializeECDH();
    } catch (error) {
      throw new Error(`Failed to initialize secure connection: ${error.message}`);
    }
  }

  // Get authentication token
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  try {
    // Include token in data payload
    const payload = { ...data, token };

    // Encrypt the data
    const jsonData = JSON.stringify(payload);
    const encryptedData = await encrypt(jsonData);

    // Get session ID
    const sessionId = getSessionId();
    if (!sessionId) {
      throw new Error('No session ID available. Security not properly initialized.');
    }

    // Create the secure request
    const secureRequest = {
      sessionId,
      encryptedData
    };

    // Make the request
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(secureRequest)
    });

    if (!response.ok) {
      const errorStatus = response.status;
      let errorMessage = '';

      try {
        // Try to parse error message from response
        const errorData = await response.json();
        errorMessage = errorData.message || `Request failed with status: ${errorStatus}`;
      } catch {
        errorMessage = `Request failed with status: ${errorStatus}`;
      }

      // Handle specific status codes
      if (errorStatus === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (errorStatus === 403) {
        throw new Error('You do not have permission to perform this action.');
      } else {
        throw new Error(errorMessage);
      }
    }

    // Handle successful response
    const responseData = await response.json();

    // If the response is encrypted, decrypt it
    if (responseData && responseData.encryptedData) {
      const decryptedResponse = await decrypt(responseData.encryptedData);
      return JSON.parse(decryptedResponse);
    }

    // Return raw response if not encrypted
    return responseData;
  } catch (error) {
    console.error('Secure API call failed:', error);
    throw error;
  }
};

/**
 * Upload a file securely with additional encrypted data
 * @param {string} url - The API endpoint URL
 * @param {File} file - The file to upload
 * @param {Object} data - Additional data to send with the file (will be encrypted)
 * @returns {Promise<Object>} - The decrypted response data
 */
export const secureFileUpload = async (url, file, data = {}) => {
  // Ensure security is initialized
  if (!isInitialized()) {
    try {
      await initializeECDH();
    } catch (error) {
      throw new Error(`Failed to initialize secure connection: ${error.message}`);
    }
  }

  // Get authentication token
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  try {
    // First upload the file to get its path
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);

    const fileUploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!fileUploadResponse.ok) {
      const status = fileUploadResponse.status;
      if (status === 401) {
        throw new Error('Authentication required to upload files');
      } else if (status === 403) {
        throw new Error('You do not have permission to upload files');
      } else {
        throw new Error('Failed to upload file');
      }
    }

    const fileData = await fileUploadResponse.json();
    const filePath = fileData.path || fileData.imagePath;

    // Now make the secure API call with the file path included
    return secureApiCall(url, 'POST', {
      ...data,
      imagePath: filePath
    });
  } catch (error) {
    console.error('Secure file upload failed:', error);
    throw error;
  }
};

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>} - True if user is admin, false otherwise
 */
export const checkIsAdmin = async () => {
  try {
    // Ensure security is initialized
    if (!isInitialized()) {
      await initializeECDH();
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // Make a request using GET method with token as a query parameter
    const response = await fetch(`/api/auth/users/isAdmin?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};