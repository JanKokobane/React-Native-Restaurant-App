import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Star } from 'lucide-react-native';
import { FoodItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import React from 'react';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function HomeScreen() {
  const { user, loading, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const snap = await getDocs(collection(db, 'foodItems'));
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FoodItem[];
        setFoodItems(items);

        // derive categories dynamically
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('Error fetching food items:', err);
      }
    };

    fetchFoodItems();
  }, []);

  if (loading || !user) return null;

  const initials = `${user?.name?.charAt(0) || ''}${user?.surname?.charAt(0) || ''}`.toUpperCase();

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderFoodCard = (item: FoodItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.foodCard}
      onPress={() => router.push(`/food/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FCD34D" fill="#FCD34D" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.prepTime}>{item.prepTime}</Text>
        </View>
        <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>FoodDash</Text>
          <Text style={styles.headerSubtitle}>Order your favourite food!</Text>
        </View>

        <TouchableOpacity style={styles.avatarWrapper} onPress={() => setDropdownVisible(!dropdownVisible)}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setDropdownVisible(false);
                router.push('/settings');
              }}
            >
              <Text style={styles.dropdownText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={async () => {
                setDropdownVisible(false);
                await logout();
              }}
            >
              <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Search and Categories */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.foodList} contentContainerStyle={styles.foodListContent} showsVerticalScrollIndicator={false}>
        <View style={styles.foodGrid}>
          {filteredItems.map(renderFoodCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  header: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },

  avatarWrapper: { marginLeft: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },
  avatarImage: { width: 40, height: 40, borderRadius: 20 },

  dropdown: {
    position: 'absolute',
    top: 70,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,       
    paddingVertical: 8,
    width: 160,
    zIndex: 1000,       
  },
  
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 16 },
  dropdownText: { fontSize: 14, color: '#1F2937' },

  searchContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },

  categoriesContainer: { maxHeight: 50 },
  categoriesContent: { paddingHorizontal: 24, gap: 12 },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: { backgroundColor: '#EF4444' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  categoryTextActive: { color: '#ffffff' },

  foodList: { flex: 1 },
  foodListContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  foodCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  foodImage: { width: '100%', height: 140 },
  foodInfo: { padding: 12 },
  foodName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  rating: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  prepTime: { fontSize: 12, color: '#9CA3AF', marginLeft: 4 },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
});
