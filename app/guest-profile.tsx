import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

const LogoImage = require('../assets/images/fooddash-high-resolution-logo-transparent.png');


export default function GuestProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.notAuthContainer}>
        <Image source={LogoImage} style={styles.logo} />
        <Text style={styles.notAuthText}>You are continuing as a guest</Text>
        <Text style={styles.notAuthSubtext}>
          To access your profile and orders, please login or create an account.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('../auth/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('../auth/register')}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  notAuthContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 300, height: 100, resizeMode: 'contain', marginBottom: 30 },
  notAuthText: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  notAuthSubtext: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  loginButton: { backgroundColor: '#EF4444', padding: 14, borderRadius: 12, marginBottom: 12 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  registerButton: { borderColor: '#EF4444', borderWidth: 2, padding: 14, borderRadius: 12 },
  registerButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});
