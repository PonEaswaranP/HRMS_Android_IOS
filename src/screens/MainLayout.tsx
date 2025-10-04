import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userAPI } from '../api/userAPI';
import { UserInfo } from '../types';
import { MainStackParamList } from '../navigation/types';
import Sidebar from '../components/Sidebar';
import EmployeeDashboard from './EmployeeDashboard';
import HRDashboard from './HRDashboard';
import ProfileScreen from './ProfileScreen';

const { width } = Dimensions.get('window');

interface MainLayoutProps {
  navigation: StackNavigationProp<MainStackParamList>;
}

const MainLayout: React.FC<MainLayoutProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Dashboard');

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

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    
    // Navigate based on route
    switch (route) {
      case 'Profile':
        // Navigate to profile screen when implemented
        break;
      case 'Attendance':
        navigation.navigate('Attendance');
        break;
      case 'Leave':
        navigation.navigate('LeaveList');
        break;
      case 'Payslip':
        navigation.navigate('PayslipList');
        break;
      case 'EmployeeList':
        navigation.navigate('EmployeeList');
        break;
      default:
        // Stay on dashboard
        break;
    }
  };

  const renderContent = () => {
    if (!userInfo) return null;

    switch (currentRoute) {
      case 'Dashboard':
        if (userInfo.access_level.value === 'HR') {
          return <HRDashboard userInfo={userInfo} />;
        }
        return <EmployeeDashboard userInfo={userInfo} />;
      case 'Profile':
        return <ProfileScreen userInfo={userInfo} />;
      default:
        return (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>🚧</Text>
            <Text style={styles.comingSoonTitle}>{currentRoute}</Text>
            <Text style={styles.comingSoonSubtitle}>Coming Soon</Text>
          </View>
        );
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentRoute}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
          <View style={styles.sidebarContainer}>
            <Sidebar
              userInfo={userInfo}
              currentRoute={currentRoute}
              onNavigate={handleNavigate}
              onClose={() => setSidebarVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    width: width * 0.8,
    maxWidth: 300,
  },
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
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonText: {
    fontSize: 60,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default MainLayout;