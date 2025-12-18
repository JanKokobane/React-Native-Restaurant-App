import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, User, Mail, Phone, MapPin } from 'lucide-react-native';
import React from 'react';

export default function ContactInfoScreen() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const initialForm = {
    name: user?.name ?? '',
    surname: user?.surname ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    streetName: user?.streetName ?? '',
    streetNumber: user?.streetNumber ?? '',
    addressLine2: user?.addressLine2 ?? '',
    fullAddress: user?.fullAddress ?? '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setFormData(initialForm);
  }, [user]);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact info</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.infoItem}>
            <User size={20} color="#6B7280" />
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.name}
                  onChangeText={(v) => setFormData({ ...formData, name: v })}
                  placeholder="Name"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formData.surname}
                  onChangeText={(v) => setFormData({ ...formData, surname: v })}
                  placeholder="Surname"
                />
              </View>
            ) : (
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoText}>
                  {user?.name} {user?.surname}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(v) => setFormData({ ...formData, email: v })}
                placeholder="Email"
                autoCapitalize="none"
              />
            ) : (
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>{user?.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(v) => setFormData({ ...formData, phone: v })}
                placeholder="Phone"
              />
            ) : (
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoText}>{user?.phone}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            {isEditing ? (
              <View style={styles.editColumn}>
                <TextInput
                  style={styles.input}
                  value={formData.streetName}
                  onChangeText={(v) =>
                    setFormData({ ...formData, streetName: v })
                  }
                  placeholder="Street Name"
                />
                <TextInput
                  style={[styles.input, styles.marginTop]}
                  value={formData.streetNumber}
                  onChangeText={(v) =>
                    setFormData({ ...formData, streetNumber: v })
                  }
                  placeholder="Street Number"
                />
                <TextInput
                  style={[styles.input, styles.marginTop]}
                  value={formData.addressLine2}
                  onChangeText={(v) =>
                    setFormData({ ...formData, addressLine2: v })
                  }
                  placeholder="Address Line 2"
                />
                <TextInput
                  style={[styles.input, styles.marginTop]}
                  value={formData.fullAddress}
                  onChangeText={(v) =>
                    setFormData({ ...formData, fullAddress: v })
                  }
                  placeholder="Full Address"
                />
              </View>
            ) : (
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoText}>{user?.fullAddress}</Text>
              </View>
            )}
          </View>
        </View>

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
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
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
});
