import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, TextInput, ErrorMessage } from '../components';
import { apiService } from '../api/apiService';
import { tokenStorage } from '../utils/tokenStorage';
import { AuthStackParamList } from '../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter an email address');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.register(formData);
      
      // Store tokens
      await tokenStorage.setTokens(response.access, response.refresh);
      
      Alert.alert(
        'Success',
        'Registration successful! Welcome to HRMS.',
        [{ text: 'OK' }]
      );
      
      // Navigation will be handled automatically by the auth context
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.username) {
          setError(`Username: ${errorData.username[0]}`);
        } else if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Password: ${errorData.password[0]}`);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
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
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our HRMS platform today!</Text>
        </View>

        <View style={styles.formContainer}>
          <ErrorMessage message={error} />

          <TextInput
            label="Username *"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(value) => handleChange('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            label="Email *"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            value={formData.first_name}
            onChangeText={(value) => handleChange('first_name', value)}
            autoCapitalize="words"
            editable={!loading}
          />

          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.last_name}
            onChangeText={(value) => handleChange('last_name', value)}
            autoCapitalize="words"
            editable={!loading}
          />

          <TextInput
            label="Password *"
            placeholder="Choose a password"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={formData.password2}
            onChangeText={(value) => handleChange('password2', value)}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            disabled={loading}
            style={styles.loginButton}
          />
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
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 30,
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
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButton: {
    marginTop: 10,
  },
  loginButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
