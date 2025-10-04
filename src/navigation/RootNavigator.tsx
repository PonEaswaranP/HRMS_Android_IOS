// navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import EmployeeHomeScreen from '../screens/EmployeeHomeScreen';
import HRHomepage from '../screens/HRHomepage';
import { tokenStorage } from '../utils/tokenStorage';
import { ActivityIndicator, View } from 'react-native';
import LogoutButton from '../components/LogoutButton';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'employee' | 'hr' | null>(null);

  useEffect(() => {
    checkAuthStatus();
    // Set up interval to check auth status periodically
    const interval = setInterval(checkAuthStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    const loggedIn = await tokenStorage.isLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const role = await tokenStorage.getUserRole();
      setUserRole(role);
    } else {
      setUserRole(null);
    }
  };

  // Loading state
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : userRole === 'hr' ? (
          <Stack.Screen 
            name="HRHomepage" 
            component={HRHomepage}
            options={{
              title: 'HR Dashboard',
              headerRight: () => <LogoutButton />,
            }}
          />
        ) : (
          <Stack.Screen 
            name="EmployeeHomeScreen" 
            component={EmployeeHomeScreen}
            options={{
              title: 'Employee Dashboard',
              headerRight: () => <LogoutButton />,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
