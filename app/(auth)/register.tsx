import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Spacing } from '../../src/constants/theme';

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register: authRegister } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inline validations on blur
  const validateField = (fieldName: string, value: string) => {
    let err = '';
    if (fieldName === 'name') {
      if (!value.trim()) err = 'Full name is required';
    } else if (fieldName === 'email') {
      if (!value.trim()) {
        err = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        err = 'Invalid email address';
      }
    } else if (fieldName === 'password') {
      if (!value) {
        err = 'Password is required';
      } else if (value.length < 6) {
        err = 'Password must be at least 6 characters';
      }
    } else if (fieldName === 'confirmPassword') {
      if (!value) {
        err = 'Please confirm your password';
      } else if (value !== password) {
        err = 'Passwords do not match';
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const validateAll = (): boolean => {
    const errs: Record<string, string> = {};
    
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
    
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email address';
    }
    
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validateAll()) return;

    try {
      // Save mock user & registration state via useAuth
      await authRegister(name, email);

      // Redirect to main tabs discover screen
      router.replace('/(tabs)/discover');
    } catch {
      router.replace('/(tabs)/discover');
    }
  };

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          Create Account
        </Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Join Celestial Books and share your reading journey
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          onBlur={() => validateField('name', name)}
          error={errors.name}
          autoCapitalize="words"
        />

        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => validateField('email', email)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => validateField('password', password)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={() => validateField('confirmPassword', confirmPassword)}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          variant="primary"
          label="Create account"
          fullWidth
          onPress={handleRegister}
          style={styles.submitBtn}
        />
      </View>

      <View style={styles.footer}>
        <Typography variant="body" color={colors.textSecondary}>
          Already have an account?{' '}
        </Typography>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Typography variant="body" color={colors.textAccent} style={styles.loginLink}>
            Sign in
          </Typography>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing['6'],
    paddingVertical: Spacing['6'],
  },
  header: {
    marginTop: Spacing['6'],
    marginBottom: Spacing['8'],
  },
  subtitle: {
    marginTop: Spacing['2'],
  },
  form: {
    flex: 1,
  },
  submitBtn: {
    marginTop: Spacing['6'],
    marginBottom: Spacing['4'],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['6'],
    paddingBottom: Spacing['6'],
  },
  loginLink: {
    fontWeight: '600',
  },
});
