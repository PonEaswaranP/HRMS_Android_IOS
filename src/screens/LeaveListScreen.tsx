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
import { Leave } from '../types';
import { MainStackParamList } from '../navigation/types';

type LeaveListScreenNavigationProp = StackNavigationProp<MainStackParamList, 'LeaveList'>;

interface Props {
  navigation: LeaveListScreenNavigationProp;
}

const LeaveListScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchLeaves = async () => {
    try {
      setError('');
      const statusFilter = filter === 'all' ? undefined : filter;
      const data = await apiService.getLeaves(statusFilter);
      setLeaves(data);
    } catch (err: any) {
      console.error('Leaves fetch error:', err);
      setError('Failed to load leaves');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaves();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#d4edda';
      case 'rejected':
        return '#f8d7da';
      case 'pending':
        return '#fff3cd';
      default:
        return '#e2e3e5';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#155724';
      case 'rejected':
        return '#721c24';
      case 'pending':
        return '#856404';
      default:
        return '#383d41';
    }
  };

  const renderLeave = ({ item }: { item: Leave }) => (
    <Card style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <View style={styles.leaveTypeContainer}>
          <Text style={styles.leaveType}>{item.leave_type}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}>
            <Text
              style={[
                styles.statusText,
                { color: getStatusTextColor(item.status) },
              ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.leaveDetails}>
        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>
            {new Date(item.start_date).toLocaleDateString()} -{' '}
            {new Date(item.end_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Days:</Text>
          <Text style={styles.value}>{item.days_count} days</Text>
        </View>
        <View style={styles.reasonContainer}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.reason}>{item.reason}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Applied on:</Text>
          <Text style={styles.value}>
            {new Date(item.applied_on).toLocaleDateString()}
          </Text>
        </View>
        {item.rejection_reason && (
          <View style={styles.rejectionContainer}>
            <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
            <Text style={styles.rejectionText}>{item.rejection_reason}</Text>
          </View>
        )}
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner text="Loading leaves..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}>
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'approved' && styles.activeFilter]}
          onPress={() => setFilter('approved')}>
          <Text style={[styles.filterText, filter === 'approved' && styles.activeFilterText]}>
            Approved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'rejected' && styles.activeFilter]}
          onPress={() => setFilter('rejected')}>
          <Text style={[styles.filterText, filter === 'rejected' && styles.activeFilterText]}>
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      <ErrorMessage message={error} style={styles.errorMessage} />

      <FlatList
        data={leaves}
        renderItem={renderLeave}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No leave applications found</Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('LeaveApplication')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  errorMessage: {
    margin: 16,
    marginBottom: 0,
  },
  listContent: {
    padding: 16,
  },
  leaveCard: {
    marginBottom: 12,
  },
  leaveHeader: {
    marginBottom: 12,
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leaveDetails: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  reasonContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reason: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
    lineHeight: 20,
  },
  rejectionContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 6,
  },
  rejectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#721c24',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#721c24',
    lineHeight: 18,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});

export default LeaveListScreen;
