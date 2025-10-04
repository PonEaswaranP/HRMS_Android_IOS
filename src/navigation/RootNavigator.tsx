// navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { tokenStorage } from '../utils/tokenStorage';
import { ActivityIndicator, View } from 'react-native';
import LogoutButton from '../components/LogoutButton';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Set up interval to check auth status periodically
    const interval = setInterval(checkAuthStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    const loggedIn = await tokenStorage.isLoggedIn();
    setIsLoggedIn(loggedIn);
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
        ) : (
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'HRMS Dashboard',
              headerRight: () => <LogoutButton />,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
