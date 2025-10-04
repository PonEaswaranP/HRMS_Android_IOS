import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { handleLogout } from '../utils/logoutHandler';

const ExampleDashboardScreen: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handle logout button press
   * Shows loading state and calls the logout handler
   */
  const onLogoutPress = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout handler
      await handleLogout();
      
      // Optional: Show success message (though navigation will likely happen automatically)
      console.log('Logout completed successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Optional: Show error alert if needed
      Alert.alert('Logout Error', 'An error occurred during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      {/* Your dashboard content here */}
      <View style={styles.content}>
        <Text>Welcome to your dashboard!</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          isLoggingOut && styles.logoutButtonDisabled
        ]}
        onPress={onLogoutPress}
        disabled={isLoggingOut}
        activeOpacity={0.8}>
        {isLoggingOut ? (
          <View style={styles.logoutButtonContent}>
            <ActivityIndicator color="#fff" size="small" style={styles.loadingSpinner} />
            <Text style={styles.logoutButtonText}>Logging out...</Text>
          </View>
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Red color for logout
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExampleDashboardScreen;