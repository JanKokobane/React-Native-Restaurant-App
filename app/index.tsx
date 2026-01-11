import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import React from 'react';

const LogoImage = require('../assets/images/fooddash-high-resolution-logo-transparent.png');

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { isAuthenticated, loading } = useAuth(); 

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/(tabs)'); 
    }
  }, [isAuthenticated, loading]);

  if (loading) return null; 

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
          }}
          style={styles.image}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>
        <Image source={LogoImage} style={styles.logo} />

        <Text style={styles.subtitle}>Order your favourite food!</Text>
        <Text style={styles.description}>
          Enjoy the best meals—whether you're dining in, reserving a table, or ordering takeout.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e01515ff',
  },
  imageContainer: {
    width: width,
    height: height * 0.3,
    position: 'relative',
    marginBottom: -20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
    marginTop: -45,
  },
  subtitle: {
    fontSize: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  registerButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
