import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Card, LoadingSpinner, ErrorMessage } from '../components';
import { apiService } from '../api/apiService';
import { Employee } from '../types';
import { MainStackParamList } from '../navigation/types';

type EmployeeProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'EmployeeProfile'
>;
type EmployeeProfileScreenRouteProp = RouteProp<MainStackParamList, 'EmployeeProfile'>;

interface Props {
  navigation: EmployeeProfileScreenNavigationProp;
  route: EmployeeProfileScreenRouteProp;
}

const EmployeeProfileScreen: React.FC<Props> = ({ route }) => {
  const { employeeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setError('');
        const data = await apiService.getEmployee(employeeId);
        setEmployee(data);
      } catch (err: any) {
        console.error('Employee fetch error:', err);
        setError('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return <LoadingSpinner text="Loading employee profile..." />;
  }

  if (!employee) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error || 'Employee not found'} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>
            {employee.first_name} {employee.last_name}
          </Text>
          <View style={[
            styles.statusBadge,
            employee.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            <Text style={styles.statusText}>{employee.status}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Employee Information</Text>
        <InfoRow label="Employee ID" value={employee.employee_id} />
        <InfoRow label="Email" value={employee.email} />
        <InfoRow label="Phone" value={employee.phone} />
        <InfoRow label="Department" value={employee.department} />
        <InfoRow label="Designation" value={employee.designation} />
        <InfoRow
          label="Date of Joining"
          value={new Date(employee.date_of_joining).toLocaleDateString()}
        />
      </Card>

      {employee.address && (
        <Card>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressText}>{employee.address}</Text>
        </Card>
      )}

      {employee.date_of_birth && (
        <Card>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoRow
            label="Date of Birth"
            value={new Date(employee.date_of_birth).toLocaleDateString()}
          />
        </Card>
      )}
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeStatus: {
    backgroundColor: '#d4edda',
  },
  inactiveStatus: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default EmployeeProfileScreen;
