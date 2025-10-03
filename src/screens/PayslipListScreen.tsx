import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, LoadingSpinner, ErrorMessage } from '../components';
import { apiService } from '../api/apiService';
import { Payslip } from '../types';

const PayslipListScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchPayslips = async () => {
    try {
      setError('');
      const data = await apiService.getPayslips();
      setPayslips(data);
    } catch (err: any) {
      console.error('Payslips fetch error:', err);
      setError('Failed to load payslips');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayslips();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const renderPayslip = ({ item }: { item: Payslip }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity onPress={() => toggleExpand(item.id)}>
        <Card style={styles.payslipCard}>
          <View style={styles.payslipHeader}>
            <View>
              <Text style={styles.monthYear}>
                {getMonthName(item.month)} {item.year}
              </Text>
              <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryLabel}>Net Salary</Text>
              <Text style={styles.salary}>
                ₹{item.net_salary.toLocaleString()}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <View style={styles.payslipDetails}>
              <Text style={styles.sectionTitle}>Earnings</Text>
              <PayslipRow label="Basic Salary" value={item.basic_salary} />
              <PayslipRow label="HRA" value={item.hra} />
              <PayslipRow label="DA" value={item.da} />
              <PayslipRow label="Medical Allowance" value={item.medical_allowance} />
              <PayslipRow label="Transport Allowance" value={item.transport_allowance} />
              <PayslipRow label="Other Allowances" value={item.other_allowances} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Gross Salary</Text>
                <Text style={styles.totalValue}>₹{item.gross_salary.toLocaleString()}</Text>
              </View>

              <View style={styles.separator} />

              <Text style={styles.sectionTitle}>Deductions</Text>
              <PayslipRow label="PF Deduction" value={item.pf_deduction} />
              <PayslipRow label="Tax Deduction" value={item.tax_deduction} />
              <PayslipRow label="Other Deductions" value={item.other_deductions} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Deductions</Text>
                <Text style={styles.totalValue}>₹{item.total_deductions.toLocaleString()}</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.netSalaryRow}>
                <Text style={styles.netSalaryLabel}>Net Salary</Text>
                <Text style={styles.netSalaryValue}>
                  ₹{item.net_salary.toLocaleString()}
                </Text>
              </View>

              {item.payment_date && (
                <View style={styles.paymentDateContainer}>
                  <Text style={styles.paymentDateLabel}>Payment Date:</Text>
                  <Text style={styles.paymentDate}>
                    {new Date(item.payment_date).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.expandIndicator}>
            <Text style={styles.expandText}>
              {isExpanded ? '▲ Tap to collapse' : '▼ Tap to view details'}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'processed':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      default:
        return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading payslips..." />;
  }

  return (
    <View style={styles.container}>
      <ErrorMessage message={error} style={styles.errorMessage} />

      <FlatList
        data={payslips}
        renderItem={renderPayslip}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payslips available</Text>
          </View>
        }
      />
    </View>
  );
};

const PayslipRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View style={styles.payslipRow}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>₹{value.toLocaleString()}</Text>
  </View>
);

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
  payslipCard: {
    marginBottom: 12,
  },
  payslipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  salaryContainer: {
    alignItems: 'flex-end',
  },
  salaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  salary: {
    fontSize: 22,
    fontWeight: '700',
    color: '#28a745',
  },
  expandIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  expandText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  payslipDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  payslipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 14,
    color: '#666',
  },
  rowValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  netSalaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e7f3ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  netSalaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  netSalaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  paymentDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  paymentDateLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
  },
  paymentDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
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

export default PayslipListScreen;
