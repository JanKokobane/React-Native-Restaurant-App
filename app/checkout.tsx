import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useCart } from '@/context/CartContext';
import { router } from 'expo-router';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { getCartTotal, cart, clearCart } = useCart(); 
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Only use cart total
  const total = getCartTotal();
  const grandTotal = total; // no delivery fee

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateCard = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!cardName || cardName.length < 3) {
      newErrors.cardName = 'Invalid cardholder name';
    }
    if (!expiryDate || expiryDate.length < 5) {
      newErrors.expiryDate = 'Invalid expiry date';
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    if (!streetAddress || streetAddress.length < 5) {
      newErrors.streetAddress = 'Enter a valid street address';
    }
    if (!city) {
      newErrors.city = 'City is required';
    }
    if (!postalCode || postalCode.length < 4) {
      newErrors.postalCode = 'Invalid postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardPayment = async () => {
    if (!validateCard()) return;

    if (!user?.id) {
      Alert.alert('Error', 'User not logged in. Please login and try again.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        selectedSides: item.selectedSides,
        removedIngredients: item.removedIngredients,
        foodItem: {
          id: item.foodItem.id,
          name: item.foodItem.name,
          price: item.foodItem.price,
          image: item.foodItem.image || null,
        },
        selectedDrink: item.selectedDrink
          ? {
              id: item.selectedDrink.id,
              name: item.selectedDrink.name,
              price: item.selectedDrink.price,
            }
          : null,
        selectedExtras: item.selectedExtras.map(extra => ({
          id: extra.id,
          name: extra.name,
          price: extra.price,
        })),
      }));

      await addDoc(collection(db, "orders"), {
        items: orderItems,
        subtotal: Number(total),
        total: Number(grandTotal), // ✅ no delivery fee
        address: {
          street: streetAddress,
          city,
          postalCode: postalCode || null,
        },
        payment: {
          method: "card",
          cardHolder: cardName,
          last4: cardNumber ? cardNumber.slice(-4) : "",
        },
        status: "PENDING",
        createdAt: serverTimestamp(),
        userId: user.id,
      });

      clearCart();
      router.replace('./order-success');
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) { 
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#DC2626', '#B91C1C']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerBadge}>
            <Lock color="#FFFFFF" size={16} />
            <Text style={styles.headerBadgeText}>Secure</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* ORDER SUMMARY */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R{total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>⏳ Hang tight — your delicious order is on the way. FoodDash</Text>
              {/* <Text style={styles.summaryValue}>R{deliveryFee.toFixed(2)}</Text> */}
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* PAYMENT METHOD */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={[styles.paymentOption, styles.paymentOptionActive]}>
              <View style={styles.paymentOptionLeft}>
                <View style={styles.paymentIconContainer}>
                  <CreditCard color="#DC2626" size={24} />
                </View>
                <Text style={styles.paymentOptionText}>Credit / Debit Card</Text>
              </View>
              <View style={[styles.radio, styles.radioActive]}>
                <View style={styles.radioDot} />
              </View>
            </View>
          </View>

          {/* CARD DETAILS */}
          <View style={styles.cardForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                maxLength={19}
              />
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={[styles.input, errors.cardName && styles.inputError]}
                placeholder="Enter name as it appears on card"
                placeholderTextColor="#9CA3AF"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
              {errors.cardName && <Text style={styles.errorText}>{errors.cardName}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate && styles.inputError]}
                  placeholder="MM/YY"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  maxLength={5}
                />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  placeholder="123"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={cvv}
                  onChangeText={(text) => setCvv(text.substring(0, 4))}
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>
          </View>

          {/* ✅ DELIVERY ADDRESS (ADDED – SAME FORMAT) */}
          <View style={[styles.cardForm, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={[styles.input, errors.streetAddress && styles.inputError]}
                placeholder="123 Main Street"
                placeholderTextColor="#9CA3AF"
                value={streetAddress}
                onChangeText={setStreetAddress}
              />
              {errors.streetAddress && <Text style={styles.errorText}>{errors.streetAddress}</Text>}
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  placeholder="Johannesburg"
                  placeholderTextColor="#9CA3AF"
                  value={city}
                  onChangeText={setCity}
                />
                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Postal Code</Text>
                <TextInput
                  style={[styles.input, errors.postalCode && styles.inputError]}
                  placeholder="2001"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  maxLength={5}
                />
                {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handleCardPayment}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#B91C1C']}
            style={styles.payButtonGradient}
          >
            <Lock color="#FFFFFF" size={20} />
            <Text style={styles.payButtonText}>
              {loading ? 'Processing...' : `Pay R${grandTotal.toFixed(2)}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOptionActive: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paypalIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003087',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#DC2626',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
  },
  cardForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 25,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
