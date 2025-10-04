import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { userAPI } from '../api/userAPI';
import { UserInfo } from '../types';
import EmployeeDashboard from './EmployeeDashboard';
import HRDashboard from './HRDashboard';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await userAPI.getCurrentUser();
      setUserInfo(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load user information';
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'Retry',
            onPress: () => loadUserData(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !userInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Unable to Load Dashboard</Text>
        <Text style={styles.errorMessage}>
          {error || 'Please try again later'}
        </Text>
      </View>
    );
  }

  // Render appropriate dashboard based on access level
  if (userInfo.role.name === 'HR') {
    return <HRDashboard userInfo={userInfo} />;
  }

  return <EmployeeDashboard userInfo={userInfo} />;
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Dashboard;
