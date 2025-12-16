import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronLeft,
  User,
  Bell,
  ShoppingBag,
  Shield,
  Eye,
  CreditCard,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result.success) {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Communications</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <User size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Contact info</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Bell size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Notification preferences</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <ShoppingBag size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Marketing preferences</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Account info</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Shield size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Login and security</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Eye size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Data and privacy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Finances</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <CreditCard size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Payment preferences</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Close Your Account</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
