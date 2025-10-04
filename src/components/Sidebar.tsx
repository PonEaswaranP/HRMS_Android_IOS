import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tokenStorage } from '../utils/tokenStorage';
import { userAPI } from '../api/userAPI';
import { UserInfo } from '../types';

interface SidebarProps {
  userInfo: UserInfo;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  accessLevels?: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🏠',
    route: 'Dashboard',
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: '👤',
    route: 'Profile',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: '⏰',
    route: 'Attendance',
  },
  {
    id: 'leave',
    title: 'Leave Management',
    icon: '📅',
    route: 'Leave',
  },
  {
    id: 'payslip',
    title: 'Payslips',
    icon: '💰',
    route: 'Payslip',
  },
  {
    id: 'employees',
    title: 'Employee List',
    icon: '👥',
    route: 'EmployeeList',
    accessLevels: ['HR', 'Manager'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  userInfo,
  currentRoute,
  onNavigate,
  onClose,
}) => {
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
              onClose();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                'Logout Error',
                'Failed to logout properly, but you have been logged out locally.',
                [{ text: 'OK' }]
              );
              onClose();
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.accessLevels) return true;
    return item.accessLevels.includes(userInfo.access_level.value);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userInfo.first_name.charAt(0)}{userInfo.last_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.full_name}</Text>
            <Text style={styles.userRole}>{userInfo.role.name}</Text>
            <Text style={styles.userDepartment}>{userInfo.department.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {filteredMenuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              currentRoute === item.route && styles.activeMenuItem,
            ]}
            onPress={() => {
              onNavigate(item.route);
              onClose();
            }}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.menuText,
                currentRoute === item.route && styles.activeMenuText,
              ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]} 
          onPress={handleLogout}
          disabled={loggingOut}>
          {loggingOut ? (
            <ActivityIndicator size="small" color="#ff4444" style={styles.logoutIcon} />
          ) : (
            <Text style={styles.logoutIcon}>🚪</Text>
          )}
          <Text style={styles.logoutText}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeMenuItem: {
    backgroundColor: '#f8f9fa',
    borderRightWidth: 4,
    borderRightColor: '#007AFF',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeMenuText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
  },
});

export default Sidebar;