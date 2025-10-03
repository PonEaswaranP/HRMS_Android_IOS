import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, TextInput, ErrorMessage, Card } from '../components';
import { apiService } from '../api/apiService';
import { LeaveType } from '../types';
import { MainStackParamList } from '../navigation/types';

type LeaveApplicationScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'LeaveApplication'
>;

interface Props {
  navigation: LeaveApplicationScreenNavigationProp;
}

const LeaveApplicationScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    leave_type: 'casual' as LeaveType,
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const leaveTypes: LeaveType[] = ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid'];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.start_date) {
      setError('Please enter start date (YYYY-MM-DD)');
      return;
    }
    if (!formData.end_date) {
      setError('Please enter end date (YYYY-MM-DD)');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please enter reason for leave');
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.start_date) || !dateRegex.test(formData.end_date)) {
      setError('Please enter dates in YYYY-MM-DD format');
      return;
    }

    setLoading(true);

    try {
      await apiService.applyLeave(formData);
      Alert.alert(
        'Success',
        'Leave application submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      console.error('Leave application error:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to submit leave application';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>Apply for Leave</Text>
        <Text style={styles.subtitle}>Fill in the details to request time off</Text>

        <ErrorMessage message={error} />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Leave Type *</Text>
          <View style={styles.leaveTypeContainer}>
            {leaveTypes.map((type) => (
              <Button
                key={type}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                onPress={() => handleChange('leave_type', type)}
                variant={formData.leave_type === type ? 'primary' : 'secondary'}
                style={styles.leaveTypeButton}
                textStyle={styles.leaveTypeButtonText}
              />
            ))}
          </View>
        </View>

        <TextInput
          label="Start Date *"
          placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
          value={formData.start_date}
          onChangeText={(value) => handleChange('start_date', value)}
          editable={!loading}
        />

        <TextInput
          label="End Date *"
          placeholder="YYYY-MM-DD (e.g., 2024-12-27)"
          value={formData.end_date}
          onChangeText={(value) => handleChange('end_date', value)}
          editable={!loading}
        />

        <TextInput
          label="Reason *"
          placeholder="Enter reason for leave"
          value={formData.reason}
          onChangeText={(value) => handleChange('reason', value)}
          multiline
          numberOfLines={4}
          style={styles.reasonInput}
          editable={!loading}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Submit Application"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            disabled={loading}
            style={styles.cancelButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  leaveTypeButton: {
    flex: 0,
    minWidth: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  leaveTypeButtonText: {
    fontSize: 14,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 0,
  },
});

export default LeaveApplicationScreen;
