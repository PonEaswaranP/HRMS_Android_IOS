// utils/tokenStorage.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken: string) {
    try {
      await EncryptedStorage.setItem('access_token', accessToken);
      await EncryptedStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async clearTokens() {
    try {
      await EncryptedStorage.removeItem('access_token');
      await EncryptedStorage.removeItem('refresh_token');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }
};
