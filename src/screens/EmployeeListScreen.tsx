import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, LoadingSpinner, ErrorMessage, Button } from '../components';
import { apiService } from '../api/apiService';
import { Employee } from '../types';
import { MainStackParamList } from '../navigation/types';

type EmployeeListScreenNavigationProp = StackNavigationProp<MainStackParamList, 'EmployeeList'>;

interface Props {
  navigation: EmployeeListScreenNavigationProp;
}

const EmployeeListScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      setError('');
      const data = await apiService.getEmployees();
      setEmployees(data.results);
    } catch (err: any) {
      console.error('Employees fetch error:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEmployees();
  }, []);

  const renderEmployee = ({ item }: { item: Employee }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EmployeeProfile', { employeeId: item.id })}>
      <Card style={styles.employeeCard}>
        <View style={styles.employeeHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.first_name.charAt(0)}{item.last_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.employeeDesignation}>{item.designation}</Text>
            <Text style={styles.employeeDepartment}>{item.department}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner text="Loading employees..." />;
  }

  return (
    <View style={styles.container}>
      <ErrorMessage message={error} style={styles.errorMessage} />
      
      <FlatList
        data={employees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No employees found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorMessage: {
    margin: 16,
    marginBottom: 0,
  },
  listContent: {
    padding: 16,
  },
  employeeCard: {
    marginBottom: 12,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  employeeDesignation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#d4edda',
  },
  inactiveStatus: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default EmployeeListScreen;
