import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Settings,
  LifeBuoy,
  RefreshCw,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Edit2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const getInitials = () => {
    const firstInitial = user?.name?.charAt(0) || '';
    const lastInitial = user?.surname?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#EF4444', '#DC2626', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          />

          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit2 size={16} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>
              {user?.name} {user?.surname}
            </Text>

            {user?.username && (
              <Text style={styles.username}>@{user.username}</Text>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/contact-info')}
              >
                <User size={18} color="#1F2937" />
                <Text style={styles.actionButtonText}>Contact info</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/settings')}
              >
                <Settings size={18} color="#1F2937" />
                <Text style={styles.actionButtonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <LifeBuoy size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Help</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <RefreshCw size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Subscriptions</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <MessageSquare size={24} color="#1F2937" />
            <Text style={styles.menuItemText}>Message Center</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <LogOut size={20} color="#1F2937" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.legalText}>Legal agreements</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gradientHeader: {
    height: 140,
    width: '100%',
  },
  profileInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -50,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#EF4444',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
    marginTop: 4,
  },
  joinedText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuCard: {
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
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  logoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  legalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 12,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
