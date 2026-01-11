import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Minus, Plus } from 'lucide-react-native';
import { foodItems } from '@/data/foodData';
import { useCart } from '@/context/CartContext';
import { DrinkOption, ExtraOption } from '@/types';
import React from 'react';

const { width } = Dimensions.get('window');

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const foodItem = foodItems.find((item) => item.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<DrinkOption | undefined>();
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  if (!foodItem) {
    return (
      <View style={styles.container}>
        <Text>Food item not found</Text>
      </View>
    );
  }

  const maxSides = 2;

  const toggleSide = (side: string) => {
    if (selectedSides.includes(side)) {
      setSelectedSides(selectedSides.filter((s) => s !== side));
    } else if (selectedSides.length < maxSides) {
      setSelectedSides([...selectedSides, side]);
    }
  };

  const toggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.find((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients(
        removedIngredients.filter((i) => i !== ingredient)
      );
    } else {
      setRemovedIngredients([...removedIngredients, ingredient]);
    }
  };

  const calculateTotal = () => {
    let total = foodItem.price;
    if (selectedDrink && selectedDrink.price > 0) {
      total += selectedDrink.price;
    }
    selectedExtras.forEach((extra) => {
      total += extra.price;
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    addToCart(
      foodItem,
      quantity,
      selectedSides,
      selectedDrink,
      selectedExtras,
      removedIngredients
    );
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Image source={{ uri: foodItem.image }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.name}>{foodItem.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={18} color="#FCD34D" fill="#FCD34D" />
              <Text style={styles.rating}>{foodItem.rating}</Text>
              <Text style={styles.prepTime}> • {foodItem.prepTime}</Text>
            </View>
            <Text style={styles.description}>{foodItem.description}</Text>
          </View>

          {foodItem.sides && foodItem.sides.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Choose Sides (Select up to {maxSides})
              </Text>
              <View style={styles.optionsGrid}>
                {foodItem.sides.map((side) => (
                  <TouchableOpacity
                    key={side}
                    style={[
                      styles.option,
                      selectedSides.includes(side) && styles.optionSelected,
                      selectedSides.length >= maxSides &&
                        !selectedSides.includes(side) &&
                        styles.optionDisabled,
                    ]}
                    onPress={() => toggleSide(side)}
                    disabled={
                      selectedSides.length >= maxSides &&
                      !selectedSides.includes(side)
                    }>
                    <Text
                      style={[
                        styles.optionText,
                        selectedSides.includes(side) && styles.optionTextSelected,
                      ]}>
                      {side}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {foodItem.drinks && foodItem.drinks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose a Drink</Text>
              <View style={styles.optionsGrid}>
                {foodItem.drinks.map((drink) => (
                  <TouchableOpacity
                    key={drink.id}
                    style={[
                      styles.option,
                      selectedDrink?.id === drink.id && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedDrink(drink)}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedDrink?.id === drink.id &&
                          styles.optionTextSelected,
                      ]}>
                      {drink.name}
                      {drink.price > 0 && ` (+$${drink.price.toFixed(2)})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {foodItem.extras && foodItem.extras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Extras</Text>
              <View style={styles.optionsGrid}>
                {foodItem.extras.map((extra) => (
                  <TouchableOpacity
                    key={extra.id}
                    style={[
                      styles.option,
                      selectedExtras.find((e) => e.id === extra.id) &&
                        styles.optionSelected,
                    ]}
                    onPress={() => toggleExtra(extra)}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedExtras.find((e) => e.id === extra.id) &&
                          styles.optionTextSelected,
                      ]}>
                      {extra.name} (+${extra.price.toFixed(2)})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {foodItem.removableIngredients &&
            foodItem.removableIngredients.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remove Ingredients</Text>
                <View style={styles.optionsGrid}>
                  {foodItem.removableIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={[
                        styles.option,
                        removedIngredients.includes(ingredient) &&
                          styles.optionRemoved,
                      ]}
                      onPress={() => toggleIngredient(ingredient)}>
                      <Text
                        style={[
                          styles.optionText,
                          removedIngredients.includes(ingredient) &&
                            styles.optionTextRemoved,
                        ]}>
                        {ingredient}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}>
                <Plus size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: width,
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  prepTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionRemoved: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#EF4444',
  },
  optionTextRemoved: {
    color: '#ffffff',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#EF4444',
  },
  addButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
