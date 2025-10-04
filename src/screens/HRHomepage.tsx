import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Sidebar } from '../components';

const HomeScreen: React.FC = () => {
  // Mock HR data - replace with actual API calls
  const hrData = {
    name: 'Asifa',
    role: 'HR Manager',
    department: 'Human Resources',
  };

  const hrMetrics = {
    totalEmployees: 245,
    presentToday: 230,
    absentToday: 15,
    pendingLeaveApprovals: 8,
    openPositions: 5,
    newHiresThisMonth: 12,
  };

  const pendingApprovals = [
    { id: 1, employeeName: 'Rajesh Kumar', type: 'Casual Leave', days: 2, requestDate: '2025-10-02' },
    { id: 2, employeeName: 'Priya Sharma', type: 'Sick Leave', days: 1, requestDate: '2025-10-03' },
    { id: 3, employeeName: 'Arun Natarajan', type: 'Privilege Leave', days: 3, requestDate: '2025-10-01' },
  ];

  const recentAlerts = [
    { id: 1, type: 'Birthday', message: '3 employees have birthdays this week', priority: 'low' },
    { id: 2, type: 'Compliance', message: 'Payroll processing due in 2 days', priority: 'high' },
    { id: 3, type: 'Onboarding', message: '2 new joiners starting Monday', priority: 'medium' },
  ];

  const upcomingInterviews = [
    { id: 1, candidate: 'Vikram Reddy', position: 'Senior Developer', time: '11:00 AM', interviewer: 'Bala sir' },
    { id: 2, candidate: 'Sneha Iyer', position: 'UI/UX Designer', time: '3:00 PM', interviewer: 'Team Lead' },
  ];

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    // Logout logic
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <Sidebar
        navigation={undefined}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back, {hrData.name}!</Text>
            <Text style={styles.employeeId}>{hrData.role} • {hrData.department}</Text>
          </View>

          {/* HR Metrics Dashboard */}
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: '#3498DB' }]}>
              <Text style={styles.metricValue}>{hrMetrics.totalEmployees}</Text>
              <Text style={styles.metricLabel}>Total Employees</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#27AE60' }]}>
              <Text style={styles.metricValue}>{hrMetrics.presentToday}</Text>
              <Text style={styles.metricLabel}>Present Today</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#E67E22' }]}>
              <Text style={styles.metricValue}>{hrMetrics.absentToday}</Text>
              <Text style={styles.metricLabel}>Absent Today</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#E74C3C' }]}>
              <Text style={styles.metricValue}>{hrMetrics.pendingLeaveApprovals}</Text>
              <Text style={styles.metricLabel}>Pending Approvals</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#9B59B6' }]}>
              <Text style={styles.metricValue}>{hrMetrics.openPositions}</Text>
              <Text style={styles.metricLabel}>Open Positions</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#1ABC9C' }]}>
              <Text style={styles.metricValue}>{hrMetrics.newHiresThisMonth}</Text>
              <Text style={styles.metricLabel}>New Hires (Oct)</Text>
            </View>
          </View>

          {/* Quick Actions for HR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>✅</Text>
                <Text style={styles.actionText}>Approve Leaves</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>👥</Text>
                <Text style={styles.actionText}>Employee Directory</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>Attendance Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💼</Text>
                <Text style={styles.actionText}>Manage Recruitment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💰</Text>
                <Text style={styles.actionText}>Process Payroll</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📝</Text>
                <Text style={styles.actionText}>Generate Reports</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pending Leave Approvals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Leave Approvals</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {pendingApprovals.map((request) => (
              <View key={request.id} style={styles.approvalCard}>
                <View style={styles.approvalInfo}>
                  <Text style={styles.employeeName}>{request.employeeName}</Text>
                  <Text style={styles.leaveType}>{request.type} • {request.days} day{request.days > 1 ? 's' : ''}</Text>
                  <Text style={styles.requestDate}>Requested: {request.requestDate}</Text>
                </View>
                <View style={styles.approvalActions}>
                  <TouchableOpacity style={styles.approveBtn}>
                    <Text style={styles.approveBtnText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn}>
                    <Text style={styles.rejectBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Alerts & Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts & Reminders</Text>
            {recentAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={[styles.alertIndicator, { backgroundColor: getPriorityColor(alert.priority) }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertType}>{alert.type}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Upcoming Interviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Interviews</Text>
            {upcomingInterviews.map((interview) => (
              <View key={interview.id} style={styles.interviewCard}>
                <View style={styles.timeIndicator}>
                  <Text style={styles.timeText}>{interview.time}</Text>
                </View>
                <View style={styles.interviewDetails}>
                  <Text style={styles.candidateName}>{interview.candidate}</Text>
                  <Text style={styles.positionText}>{interview.position}</Text>
                  <Text style={styles.interviewerText}>Interviewer: {interview.interviewer}</Text>
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
    backgroundColor: '#2C3E50',
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
    color: '#BDC3C7',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  metricCard: {
    width: '31%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '31%',
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
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    textAlign: 'center',
  },
  approvalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  approvalInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  leaveType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  approvalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    backgroundColor: '#27AE60',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rejectBtn: {
    backgroundColor: '#E74C3C',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  interviewCard: {
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
    backgroundColor: '#9B59B6',
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
  interviewDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  candidateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  positionText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  interviewerText: {
    fontSize: 12,
    color: '#95A5A6',
  },
});

export default HomeScreen;
