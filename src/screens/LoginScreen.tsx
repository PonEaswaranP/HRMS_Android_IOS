// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { axiosInstance } from '../api/axiosInstance';
import { tokenStorage } from '../utils/tokenStorage';
import { useNavigation } from '@react-navigation/native';


const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'employee' | 'hr'>('employee');

  // Development login shortcut
  const DEV_EMAIL = 'dev@dev.com';
  const DEV_PASSWORD = 'devpassword';

  const handleLogin = async () => {
    setError('');

    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }


    // Development login
    if (email.trim() === DEV_EMAIL && password === DEV_PASSWORD) {
      await tokenStorage.setTokens('dev_token', 'dev_refresh_token');
      await tokenStorage.setUserRole(role); // Store role
      setLoading(false);
      Alert.alert('Development Login', `Logged in as ${role === 'employee' ? 'Employee' : 'HR'}!`);
      setEmail('');
      setPassword('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/login/', {
        email: email.trim(),
        password: password,
      });

      const { access, refresh } = response.data;
      

      if (access) {
        await tokenStorage.setTokens(access, refresh || access);
        await tokenStorage.setUserRole(role); // Store role
        // Clear form
        setEmail('');
        setPassword('');
        // Navigation handled by RootNavigator
        Alert.alert('Success', `Logged in as ${role === 'employee' ? 'Employee' : 'HR'}!`);
      } else {
        setError('Invalid response from server');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response) {
        const errorData = err.response.data;
        setError(
          errorData.detail || 
          errorData.email?.[0] || 
          errorData.password?.[0] ||
          errorData.non_field_errors?.[0] ||
          'Invalid email or password'
        );
      } else if (err.request) {
        setError('Network error. Please check your connection');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        

        <View style={styles.headerContainer}>
          <Text style={styles.title}>HRMS Login</Text>
          <Text style={styles.subtitle}>Welcome back! Please login to continue.</Text>
        </View>

        {/* Role Selection */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: role === 'employee' ? '#007AFF' : '#eee',
              padding: 10,
              borderRadius: 8,
              marginRight: 8,
            }}
            onPress={() => setRole('employee')}
            disabled={loading}
          >
            <Text style={{ color: role === 'employee' ? '#fff' : '#333', fontWeight: 'bold' }}>Employee Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: role === 'hr' ? '#007AFF' : '#eee',
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => setRole('hr')}
            disabled={loading}
          >
            <Text style={{ color: role === 'hr' ? '#fff' : '#333', fontWeight: 'bold' }}>HR Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
              testID="email-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
              testID="password-input"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
            testID="login-button">
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f00',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
  },
  loginButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
