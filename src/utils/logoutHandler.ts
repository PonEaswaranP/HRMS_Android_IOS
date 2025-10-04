import axios from 'axios';
import { tokenStorage } from './tokenStorage';

/**
 * Handle user logout with API call and local token cleanup
 * This function performs logout in the exact sequence requested:
 * 1. Retrieve tokens
 * 2. Make API call with Bearer token
 * 3. Clear tokens locally (regardless of API success/failure)
 * 4. Handle errors gracefully
 */
export const handleLogout = async (): Promise<void> => {
  try {
    // 1. Retrieve Tokens: Get the stored access and refresh tokens
    const accessToken = await tokenStorage.getAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();
    
    if (!accessToken) {
      console.log('No access token found - clearing any remaining tokens');
      await tokenStorage.clearTokens();
      return;
    }

    console.log('Starting logout process with access token');

    // 2. API Call: Make POST request to logout endpoint
    try {
      const response = await axios.post(
        'http://192.168.1.54:8000/api/logout/',
        {}, // Empty request body as specified
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Bearer token format
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );
      
      console.log('Logout API call successful:', response.status);
    } catch (apiError) {
      // 4. Error Handling: Log errors but don't show alerts
      console.error('Logout API call failed:', apiError);
      
      // Log additional details for debugging
      if (axios.isAxiosError(apiError)) {
        const statusCode = apiError.response?.status;
        const errorData = apiError.response?.data;
        console.error(`Logout API error: Status ${statusCode}`, errorData);
      }
      
      // Continue with local logout regardless of API failure
      console.log('Continuing with local logout despite API error');
    }

    // 3. Clear Tokens: Always clear tokens locally (success or failure)
    await tokenStorage.clearTokens();
    console.log('Tokens cleared successfully - user logged out');
    
  } catch (error) {
    // Handle any other errors (token retrieval, etc.)
    console.error('Error during logout process:', error);
    
    // Ensure tokens are cleared even if there were other errors
    try {
      await tokenStorage.clearTokens();
      console.log('Tokens cleared after error');
    } catch (clearError) {
      console.error('Failed to clear tokens:', clearError);
    }
  }
};