import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { UserInfo } from '../types';
import { tokenStorage } from '../utils/tokenStorage';
import { userAPI } from '../api/userAPI';

interface ProfileScreenProps {
  userInfo: UserInfo;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userInfo }) => {
  const [loggingOut, setLoggingOut] = useState(false);

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
          onPress: async () => {
            setLoggingOut(true);
            try {
              // Call the API logout endpoint
              await userAPI.logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                'Logout Error',
                'Failed to logout properly, but you have been logged out locally.',
                [{ text: 'OK' }]
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userInfo.first_name.charAt(0)}{userInfo.last_name.charAt(0)}
          </Text>
        </View>
        <Text style={styles.fullName}>{userInfo.full_name}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{userInfo.first_name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{userInfo.last_name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userInfo.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value}>{userInfo.user_id}</Text>
        </View>
      </View>

      {/* Work Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{userInfo.role.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role Description</Text>
          <Text style={styles.value}>{userInfo.role.description}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Department</Text>
          <Text style={styles.value}>{userInfo.department.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Organization</Text>
          <Text style={styles.value}>{userInfo.organization.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Access Level</Text>
          <Text style={styles.value}>{userInfo.access_level.label}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date Joined</Text>
          <Text style={styles.value}>{formatDate(userInfo.date_joined)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, userInfo.is_active && styles.activeDot]} />
            <Text style={styles.value}>{userInfo.is_active ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📝 Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔒 Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
          onPress={handleLogout}
          disabled={loggingOut}>
          {loggingOut ? (
            <ActivityIndicator size="small" color="#f44336" style={{ marginRight: 8 }} />
          ) : (
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>🚪 </Text>
          )}
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#ffebee',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#f44336',
  },
});

export default ProfileScreen;