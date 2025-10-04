
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Sidebar } from '../components';

const EmployeeHomeScreen: React.FC = () => {
  // Mock data - replace with actual API calls
  const employeeData = {
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveBalance: 12.5,
    attendanceStatus: 'Not Marked',
  };

  const announcements = [
    { id: 1, title: 'Holiday Notice', date: '2025-10-05', content: 'Office closed on Oct 10th' },
    { id: 2, title: 'Team Meeting', date: '2025-10-04', content: 'All hands meeting at 3 PM' },
  ];

  const upcomingMeetings = [
    { id: 1, title: 'Sprint Planning', time: '10:00 AM', room: 'Conference Room A' },
    { id: 2, title: 'Client Review', time: '2:00 PM', room: 'Meeting Room 2' },
  ];

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Logout handler (optional: can be improved to call API/logout logic)
  const handleLogout = () => {
    // You can add additional logout logic here if needed
    // For now, just navigate to Login or clear token
    // navigation.navigate('Login');
  };

  // Get navigation prop from parent (React Navigation injects it)
  // HomeScreen receives navigation as a prop from Stack.Screen
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <Sidebar
        navigation={undefined /* navigation will be injected by React Navigation, or use useNavigation() if needed */}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {employeeData.name}!</Text>
            <Text style={styles.employeeId}>{employeeData.employeeId} • {employeeData.department}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{employeeData.leaveBalance}</Text>
              <Text style={styles.statLabel}>Leave Balance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.statusPending]}>{employeeData.attendanceStatus}</Text>
              <Text style={styles.statLabel}>Today's Attendance</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📍</Text>
                <Text style={styles.actionText}>Mark Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionText}>Apply Leave</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>View Payslip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>🏢</Text>
                <Text style={styles.actionText}>Book Meeting Room</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Announcements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Announcements</Text>
            {announcements.map((announcement) => (
              <View key={announcement.id} style={styles.card}>
                <Text style={styles.cardTitle}>{announcement.title}</Text>
                <Text style={styles.cardDate}>{announcement.date}</Text>
                <Text style={styles.cardContent}>{announcement.content}</Text>
              </View>
            ))}
          </View>

          {/* Upcoming Meetings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            {upcomingMeetings.map((meeting) => (
              <View key={meeting.id} style={styles.meetingCard}>
                <View style={styles.timeIndicator}>
                  <Text style={styles.timeText}>{meeting.time}</Text>
                </View>
                <View style={styles.meetingDetails}>
                  <Text style={styles.meetingTitle}>{meeting.title}</Text>
                  <Text style={styles.meetingRoom}>{meeting.room}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusPending: {
    fontSize: 16,
    color: '#E67E22',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
  meetingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeIndicator: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    justifyContent: 'center',
    minWidth: 80,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  meetingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  meetingRoom: {
    fontSize: 14,
    color: '#666',
  },
});

export default EmployeeHomeScreen;
