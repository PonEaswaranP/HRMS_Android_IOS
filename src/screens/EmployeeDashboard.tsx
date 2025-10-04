import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { UserInfo } from '../types';

interface EmployeeDashboardProps {
  userInfo: UserInfo;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userInfo }) => {
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = () => {
    // TODO: Implement check-in API call
    setCheckedIn(!checkedIn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{userInfo.full_name}</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Text style={styles.notificationText}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        
        {/* Check In Button */}
        <TouchableOpacity 
          style={[styles.checkInButton, checkedIn && styles.checkedInButton]}
          onPress={handleCheckIn}
          activeOpacity={0.8}>
          <View style={styles.checkInContent}>
            <View>
              <Text style={styles.checkInTitle}>
                {checkedIn ? 'Checked In' : 'Check In'}
              </Text>
              <Text style={styles.checkInSubtitle}>
                {checkedIn ? 'You are clocked in' : 'Start your work day'}
              </Text>
            </View>
            <View style={styles.checkInIcon}>
              <Text style={styles.checkInEmoji}>
                {checkedIn ? '✅' : '👋'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Timer Card (Placeholder) */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Today's Work Time</Text>
          <Text style={styles.timerValue}>00:00:00</Text>
          <Text style={styles.timerSubtext}>
            {checkedIn ? 'Timer running...' : 'Not started'}
          </Text>
        </View>

        {/* Reports Section */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Reports</Text>
          
          <View style={styles.reportsGrid}>
            {/* Leave Report Card */}
            <TouchableOpacity 
              style={styles.reportCard}
              activeOpacity={0.7}>
              <View style={styles.reportIconContainer}>
                <Text style={styles.reportIcon}>📅</Text>
              </View>
              <Text style={styles.reportTitle}>Leave Report</Text>
              <Text style={styles.reportValue}>5 Days</Text>
              <Text style={styles.reportSubtext}>Remaining</Text>
            </TouchableOpacity>

            {/* Annual Report Card */}
            <TouchableOpacity 
              style={styles.reportCard}
              activeOpacity={0.7}>
              <View style={styles.reportIconContainer}>
                <Text style={styles.reportIcon}>📊</Text>
              </View>
              <Text style={styles.reportTitle}>Annual Report</Text>
              <Text style={styles.reportValue}>95%</Text>
              <Text style={styles.reportSubtext}>Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Updates Section (Placeholder) */}
        <View style={styles.updatesSection}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          
          <View style={styles.updateCard}>
            <View style={styles.updateIconContainer}>
              <Text style={styles.updateIcon}>📢</Text>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>Team Meeting</Text>
              <Text style={styles.updateTime}>Today at 3:00 PM</Text>
              <Text style={styles.updateDescription}>
                Monthly team sync-up meeting
              </Text>
            </View>
          </View>

          <View style={styles.updateCard}>
            <View style={styles.updateIconContainer}>
              <Text style={styles.updateIcon}>💼</Text>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>Leave Approved</Text>
              <Text style={styles.updateTime}>Yesterday</Text>
              <Text style={styles.updateDescription}>
                Your leave request has been approved
              </Text>
            </View>
          </View>
        </View>

        {/* Department & Role Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{userInfo.department.name}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{userInfo.role.name}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#E0F0FF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  checkInButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  checkedInButton: {
    borderLeftColor: '#34C759',
  },
  checkInContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  checkInIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInEmoji: {
    fontSize: 32,
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  timerSubtext: {
    fontSize: 12,
    color: '#999',
  },
  reportsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reportsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  reportCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    fontSize: 24,
  },
  reportTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  reportValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  reportSubtext: {
    fontSize: 11,
    color: '#999',
  },
  updatesSection: {
    marginBottom: 24,
  },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  updateIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateIcon: {
    fontSize: 20,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});

export default EmployeeDashboard;
