import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, User, MapPin } from 'lucide-react-native';

// Correct logo import
const LogoImage = require('../../assets/images/fooddash-high-resolution-logo-transparent.png');

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
  setError('');

  if (
    !formData.name ||
    !formData.surname ||
    !formData.email ||
    !formData.phone ||
    !formData.address ||
    !formData.password
  ) {
    setError('Please fill in all fields');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);
  try {
    const { success, message } = await register({
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    });

    if (success) {
      router.push('./login');
    } else {
      setError(message);
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image source={LogoImage} style={styles.logo} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>

          <Text style={styles.sectionTitleInfo}>Please enter your info</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWithIcon}>
              <User color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Surname</Text>
            <View style={styles.inputWithIcon}>
              <User color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter your surname"
                value={formData.surname}
                onChangeText={(value) => updateField('surname', value)}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Mail color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Phone color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputWithIcon}>
              <MapPin color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Enter your full address"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                multiline
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWithIcon}>
              <Lock color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff color="#6B7280" size={18} /> : <Eye color="#6B7280" size={18} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWithIcon}>
              <Lock color="#6B7280" size={18} />
              <TextInput
                style={styles.inputFlex}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff color="#6B7280" size={18} /> : <Eye color="#6B7280" size={18} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('./login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#eee6e6ff' 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 24 
  },
  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  header: { 
    marginBottom: 32, 
    alignItems: 'center' 
  },
  logo: { 
    width: 300, 
    height: 100, 
    resizeMode: 'contain', 
    marginBottom: 30, 
    marginTop: -20 
  },
  title: {
     fontSize: 32, 
     fontWeight: '700', 
     color: '#1F2937', 
     marginBottom: 8 
    },
  subtitle: { 
    fontSize: 16, 
    color: '#6B7280', 
    marginBottom: 16 
  },
  errorContainer: { 
    backgroundColor: '#FEE2E2', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 16 
  },
  errorText: { 
    color: '#DC2626', 
    fontSize: 14 
  },
  form: { 
    flex: 1 
  },

  sectionTitleInfo: {
    fontSize: 18, 
     fontWeight: '600', 
     color: '#1F2937', 
     marginTop: -10, 
     marginBottom: 16
  },
  sectionTitle: {
     fontSize: 18, 
     fontWeight: '600', 
     color: '#1F2937', 
     marginTop: 16, 
     marginBottom: 16 
    },
  
  inputContainer: { 
    marginBottom: 20 
  },
  label: {
     fontSize: 14, 
     fontWeight: '600', 
     color: '#374151', 
     marginBottom: 8 
    },
  input: {
     borderWidth: 1, 
     borderColor: '#D1D5DB', 
     borderRadius: 8, 
     paddingHorizontal: 16, 
     paddingVertical: 12, 
     fontSize: 16, color: '#1F2937' 
    },
  inputWithIcon: {
     flexDirection: 'row', 
     alignItems: 'center', 
     borderWidth: 1, 
     borderColor: '#D1D5DB', 
     borderRadius: 8, 
     paddingHorizontal: 12, 
     paddingVertical: 12, 
     gap: 8 
    },
  inputFlex: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1F2937' 
  },
  registerButton: { 
    backgroundColor: '#EF4444', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 8 
  },
  registerButtonDisabled: { 
    opacity: 0.6 
  },
  registerButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  loginPrompt: {
     flexDirection: 'row', 
     justifyContent: 'center', 
     marginTop: 24, 
     marginBottom: 24 },
  loginPromptText: { 
    color: '#6B7280', 
    fontSize: 14 },
  loginLink: { 
    color: '#EF4444', 
    fontSize: 14, 
    fontWeight: '600' 
  },
});
