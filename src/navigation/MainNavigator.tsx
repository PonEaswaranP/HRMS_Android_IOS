import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainLayout from '../screens/MainLayout';
import AttendanceScreen from '../screens/AttendanceScreen';
import EmployeeListScreen from '../screens/EmployeeListScreen';
import EmployeeProfileScreen from '../screens/EmployeeProfileScreen';
import LeaveListScreen from '../screens/LeaveListScreen';
import LeaveApplicationScreen from '../screens/LeaveApplicationScreen';
import PayslipListScreen from '../screens/PayslipListScreen';
import { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      <Stack.Screen
        name="Dashboard"
        component={MainLayout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: 'Attendance' }}
      />
      <Stack.Screen
        name="EmployeeList"
        component={EmployeeListScreen}
        options={{ title: 'Employees' }}
      />
      <Stack.Screen
        name="EmployeeProfile"
        component={EmployeeProfileScreen}
        options={{ title: 'Employee Profile' }}
      />
      <Stack.Screen
        name="LeaveList"
        component={LeaveListScreen}
        options={{ title: 'My Leaves' }}
      />
      <Stack.Screen
        name="LeaveApplication"
        component={LeaveApplicationScreen}
        options={{ title: 'Apply for Leave' }}
      />
      <Stack.Screen
        name="PayslipList"
        component={PayslipListScreen}
        options={{ title: 'My Payslips' }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
