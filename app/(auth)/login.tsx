import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/hooks/useAuth';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Spacing } from '../../src/constants/theme';

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let isValid = true;
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = 'Email is required';
      isValid = false;
    }
    if (!password) {
      errs.password = 'Password is required';
      isValid = false;
    }

    setErrors(errs);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      // Mock login via useAuth
      await authLogin(email);

      router.replace('/(tabs)/discover');
    } catch {
      router.replace('/(tabs)/discover');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Check your email. (Mock link only)');
  };

  return (
    <ScreenWrapper scrollEnabled={true} style={styles.container}>
      <View style={styles.header}>
        <Typography variant="heading" color={colors.textPrimary}>
          Welcome Back
        </Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Sign in to access your library and circles
        </Typography>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Typography variant="caption" color={colors.textAccent} style={styles.forgotPasswordText}>
            Forgot Password?
          </Typography>
        </Pressable>

        <Button
          variant="primary"
          label="Sign in"
          fullWidth
          onPress={handleLogin}
          style={styles.submitBtn}
        />
      </View>

      <View style={styles.footer}>
        <Typography variant="body" color={colors.textSecondary}>
          {"Don't have an account? "}
        </Typography>
        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Typography variant="body" color={colors.textAccent} style={styles.registerLink}>
            Get started
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
    marginTop: Spacing['8'],
    marginBottom: Spacing['8'],
  },
  subtitle: {
    marginTop: Spacing['2'],
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: Spacing['2'],
  },
  forgotPasswordText: {
    fontWeight: '500',
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
  registerLink: {
    fontWeight: '600',
  },
});
