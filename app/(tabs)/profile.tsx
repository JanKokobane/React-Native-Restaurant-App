import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, CreditCard, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    cardNumber: user?.cardNumber || '',
    cardExpiry: user?.cardExpiry || '',
  });

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.notAuthContainer}>
          <Text style={styles.notAuthText}>You are not logged in</Text>
          <Text style={styles.notAuthSubtext}>
            Please login to view your profile
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('../auth/login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('../auth/register')}>
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      cardNumber: user?.cardNumber || '',
      cardExpiry: user?.cardExpiry || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={48} color="#EF4444" />
          </View>
          <Text style={styles.userName}>
            {user?.name} {user?.surname}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoItem}>
            <User size={20} color="#6B7280" />
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.name}
                  onChangeText={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  placeholder="Name"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.surname}
                  onChangeText={(value) =>
                    setFormData({ ...formData, surname: value })
                  }
                  placeholder="Surname"
                />
              </View>
            ) : (
              <Text style={styles.infoText}>
                {user?.name} {user?.surname}
              </Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) =>
                  setFormData({ ...formData, email: value })
                }
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoText}>{user?.email}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                placeholder="Phone"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoText}>{user?.phone}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) =>
                  setFormData({ ...formData, address: value })
                }
                placeholder="Address"
                multiline
              />
            ) : (
              <Text style={styles.infoText}>{user?.address}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>

          <View style={styles.infoItem}>
            <CreditCard size={20} color="#6B7280" />
            {isEditing ? (
              <View style={styles.editColumn}>
                <TextInput
                  style={styles.input}
                  value={formData.cardNumber}
                  onChangeText={(value) =>
                    setFormData({ ...formData, cardNumber: value })
                  }
                  placeholder="Card Number"
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.marginTop]}
                  value={formData.cardExpiry}
                  onChangeText={(value) =>
                    setFormData({ ...formData, cardExpiry: value })
                  }
                  placeholder="Expiry (MM/YY)"
                  maxLength={5}
                />
              </View>
            ) : (
              <View style={styles.infoColumn}>
                <Text style={styles.infoText}>{user?.cardNumber}</Text>
                <Text style={styles.infoSubtext}>
                  Expires: {user?.cardExpiry}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#EF4444',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  notAuthText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  notAuthSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  infoColumn: {
    flex: 1,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  editColumn: {
    flex: 1,
  },
  halfInput: {
    flex: 1,
  },
  marginTop: {
    marginTop: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
    gap: 8,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
