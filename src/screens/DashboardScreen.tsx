import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, LoadingSpinner, ErrorMessage, Button } from '../components';
import { apiService } from '../api/apiService';
import { tokenStorage } from '../utils/tokenStorage';
import { DashboardSummary } from '../types';
import { MainStackParamList } from '../navigation/types';

type DashboardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError('');
      const data = await apiService.getDashboardSummary();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await apiService.logout();
    // Navigation will be handled by the auth context
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ErrorMessage message={error} />

        {/* Attendance Card */}
        <Card>
          <Text style={styles.cardTitle}>Today's Attendance</Text>
          {dashboardData?.attendance_today ? (
            <View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, styles.statusBadge]}>
                  {dashboardData.attendance_today.status.toUpperCase()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Check-in:</Text>
                <Text style={styles.value}>
                  {new Date(dashboardData.attendance_today.check_in_time).toLocaleTimeString()}
                </Text>
              </View>
              {dashboardData.attendance_today.check_out_time && (
                <View style={styles.row}>
                  <Text style={styles.label}>Check-out:</Text>
                  <Text style={styles.value}>
                    {new Date(dashboardData.attendance_today.check_out_time).toLocaleTimeString()}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noDataText}>No attendance record for today</Text>
          )}
          <Button
            title="Go to Attendance"
            onPress={() => navigation.navigate('Attendance')}
            style={styles.cardButton}
          />
        </Card>

        {/* Pending Leaves Card */}
        <Card>
          <Text style={styles.cardTitle}>Pending Leaves</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Count:</Text>
            <Text style={[styles.value, styles.countBadge]}>
              {dashboardData?.pending_leaves_count || 0}
            </Text>
          </View>
          {dashboardData?.pending_leaves && dashboardData.pending_leaves.length > 0 && (
            <View style={styles.leavesList}>
              {dashboardData.pending_leaves.slice(0, 3).map((leave) => (
                <View key={leave.id} style={styles.leaveItem}>
                  <Text style={styles.leaveType}>{leave.leave_type}</Text>
                  <Text style={styles.leaveDates}>
                    {new Date(leave.start_date).toLocaleDateString()} -{' '}
                    {new Date(leave.end_date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <Button
            title="Manage Leaves"
            onPress={() => navigation.navigate('LeaveList')}
            style={styles.cardButton}
          />
        </Card>

        {/* Latest Payslip Card */}
        <Card>
          <Text style={styles.cardTitle}>Latest Payslip</Text>
          {dashboardData?.latest_payslip ? (
            <View>
              <View style={styles.row}>
                <Text style={styles.label}>Month/Year:</Text>
                <Text style={styles.value}>
                  {dashboardData.latest_payslip.month}/{dashboardData.latest_payslip.year}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Net Salary:</Text>
                <Text style={[styles.value, styles.salaryAmount]}>
                  ₹{dashboardData.latest_payslip.net_salary.toLocaleString()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, styles.statusBadge]}>
                  {dashboardData.latest_payslip.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No payslip available</Text>
          )}
          <Button
            title="View Payslips"
            onPress={() => navigation.navigate('PayslipList')}
            style={styles.cardButton}
          />
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button
            title="View Employees"
            onPress={() => navigation.navigate('EmployeeList')}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Apply for Leave"
            onPress={() => navigation.navigate('LeaveApplication')}
            variant="success"
            style={styles.actionButton}
          />
        </Card>
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#e7f3ff',
    color: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  countBadge: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 16,
  },
  salaryAmount: {
    fontSize: 18,
    color: '#28a745',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  cardButton: {
    marginTop: 12,
  },
  leavesList: {
    marginTop: 8,
    marginBottom: 8,
  },
  leaveItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  leaveType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  leaveDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default DashboardScreen;
