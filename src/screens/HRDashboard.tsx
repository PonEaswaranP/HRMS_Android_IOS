import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { UserInfo } from '../types';

interface HRDashboardProps {
  userInfo: UserInfo;
}

interface DashboardStats {
  totalEmployees: number;
  pendingLeaves: number;
  presentToday: number;
  pendingApprovals: number;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    pendingLeaves: 0,
    presentToday: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const data = await hrAPI.getDashboardStats();
      // setStats(data);
      
      // Simulated delay for loading
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      
      // Placeholder data (remove when real API is connected)
      setStats({
        totalEmployees: 0,
        pendingLeaves: 0,
        presentToday: 0,
        pendingApprovals: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: string;
    color: string;
    onPress?: () => void;
  }> = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <Text style={styles.statIcon}>{icon}</Text>
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickAction: React.FC<{
    title: string;
    icon: string;
    onPress: () => void;
  }> = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userInfo.full_name}</Text>
          <Text style={styles.roleText}>{userInfo.role.name}</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading dashboard data...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Employees"
                value={stats.totalEmployees}
                icon="👥"
                color="#007AFF"
                onPress={() => {/* Navigate to employee list */}}
              />
              <StatCard
                title="Pending Leaves"
                value={stats.pendingLeaves}
                icon="📅"
                color="#FF9500"
                onPress={() => {/* Navigate to leave approvals */}}
              />
              <StatCard
                title="Present Today"
                value={stats.presentToday}
                icon="✅"
                color="#34C759"
                onPress={() => {/* Navigate to attendance */}}
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                icon="⏳"
                color="#FF3B30"
                onPress={() => {/* Navigate to approvals */}}
              />
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <QuickAction
              title="Employee List"
              icon="👥"
              onPress={() => {/* Navigate to employee list */}}
            />
            <QuickAction
              title="Leave Approvals"
              icon="📝"
              onPress={() => {/* Navigate to leave approvals */}}
            />
            <QuickAction
              title="Attendance Report"
              icon="📊"
              onPress={() => {/* Navigate to reports */}}
            />
            <QuickAction
              title="Add Employee"
              icon="➕"
              onPress={() => {/* Navigate to add employee */}}
            />
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesSection}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📋</Text>
            <Text style={styles.placeholderTitle}>No Recent Activities</Text>
            <Text style={styles.placeholderText}>
              Recent employee activities and updates will appear here once connected to the API.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    minHeight: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activitiesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  placeholderContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HRDashboard;