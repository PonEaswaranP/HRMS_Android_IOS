import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@hrms_access_token';
const REFRESH_TOKEN_KEY = '@hrms_refresh_token';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw error;
    }
  },

  async setAccessToken(accessToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    } catch (error) {
      console.error('Error setting access token:', error);
      throw error;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },

  async hasTokens(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      return accessToken !== null;
    } catch (error) {
      return false;
    }
  },
};
