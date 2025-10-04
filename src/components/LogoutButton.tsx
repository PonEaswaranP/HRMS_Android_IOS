// components/LogoutButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { axiosInstance } from '../api/axiosInstance';
import { tokenStorage } from '../utils/tokenStorage';
import { useNavigation } from '@react-navigation/native';

const LogoutButton: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    setLoading(true);

    try {
      // Optional: Call backend logout endpoint if it exists
      await axiosInstance.post('/logout/');
    } catch (error) {
      console.log('Logout endpoint error (non-critical):', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear tokens locally
      await tokenStorage.clearTokens();
      setLoading(false);
      
      // Navigation will be handled by RootNavigator detecting cleared tokens
      Alert.alert('Success', 'Logged out successfully');
    }
  };

  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.logoutText}>Logout</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LogoutButton;
