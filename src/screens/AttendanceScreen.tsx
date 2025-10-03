import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, LoadingSpinner, ErrorMessage, Button } from '../components';
import { apiService } from '../api/apiService';
import { Attendance } from '../types';

const AttendanceScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);

  const fetchTodayAttendance = async () => {
    try {
      setError('');
      const data = await apiService.getTodayAttendance();
      setTodayAttendance(data);
    } catch (err: any) {
      console.error('Attendance fetch error:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodayAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError('');
    try {
      const data = await apiService.checkIn();
      setTodayAttendance(data);
      Alert.alert('Success', 'Check-in successful!');
    } catch (err: any) {
      console.error('Check-in error:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to check in. Please try again.';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.id) return;

    setActionLoading(true);
    setError('');
    try {
      const data = await apiService.checkOut(todayAttendance.id);
      setTodayAttendance(data);
      Alert.alert('Success', 'Check-out successful!');
    } catch (err: any) {
      console.error('Check-out error:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to check out. Please try again.';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading attendance..." />;
  }

  const canCheckIn = !todayAttendance;
  const canCheckOut = todayAttendance && !todayAttendance.check_out_time;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ErrorMessage message={error} />

        <Card>
          <Text style={styles.title}>Today's Attendance</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</Text>

          {todayAttendance ? (
            <View style={styles.attendanceInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, styles.statusBadge]}>
                  {todayAttendance.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Check-in Time:</Text>
                <Text style={styles.value}>
                  {new Date(todayAttendance.check_in_time).toLocaleTimeString()}
                </Text>
              </View>

              {todayAttendance.check_out_time && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Check-out Time:</Text>
                    <Text style={styles.value}>
                      {new Date(todayAttendance.check_out_time).toLocaleTimeString()}
                    </Text>
                  </View>

                  {todayAttendance.work_hours && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Work Hours:</Text>
                      <Text style={styles.value}>
                        {todayAttendance.work_hours.toFixed(2)} hours
                      </Text>
                    </View>
                  )}
                </>
              )}

              {todayAttendance.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.label}>Notes:</Text>
                  <Text style={styles.notesText}>{todayAttendance.notes}</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noAttendanceContainer}>
              <Text style={styles.noAttendanceText}>
                You haven't checked in yet today.
              </Text>
            </View>
          )}
        </Card>

        <Card>
          <Text style={styles.actionsTitle}>Actions</Text>
          
          {canCheckIn && (
            <Button
              title="Check In"
              onPress={handleCheckIn}
              loading={actionLoading}
              variant="success"
              style={styles.actionButton}
            />
          )}

          {canCheckOut && (
            <Button
              title="Check Out"
              onPress={handleCheckOut}
              loading={actionLoading}
              variant="danger"
              style={styles.actionButton}
            />
          )}

          {!canCheckIn && !canCheckOut && (
            <View style={styles.completedContainer}>
              <Text style={styles.completedText}>
                ✓ Attendance completed for today
              </Text>
            </View>
          )}
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
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  attendanceInfo: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#d4edda',
    color: '#155724',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    fontStyle: 'italic',
  },
  noAttendanceContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noAttendanceText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    marginTop: 8,
  },
  completedContainer: {
    backgroundColor: '#d4edda',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#155724',
    fontWeight: '600',
  },
});

export default AttendanceScreen;
