import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, FoodItem, DrinkOption, ExtraOption } from '@/types';
import React from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    foodItem: FoodItem,
    quantity: number,
    selectedSides: string[],
    selectedDrink?: DrinkOption,
    selectedExtras?: ExtraOption[],
    removedIngredients?: string[]
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    foodItem: FoodItem,
    quantity: number,
    selectedSides: string[],
    selectedDrink?: DrinkOption,
    selectedExtras: ExtraOption[] = [],
    removedIngredients: string[] = []
  ) => {
    let totalPrice = foodItem.price;

    if (selectedDrink && selectedDrink.price > 0) {
      totalPrice += selectedDrink.price;
    }

    selectedExtras.forEach((extra) => {
      totalPrice += extra.price;
    });

    totalPrice *= quantity;

    const cartItem: CartItem = {
      foodItem,
      quantity,
      selectedSides,
      selectedDrink,
      selectedExtras,
      removedIngredients,
      totalPrice,
      cartItemId: Math.random().toString(36).substring(7),
    };

    setCart((prevCart) => [...prevCart, cartItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const basePrice =
            (item.foodItem.price +
              (item.selectedDrink?.price || 0) +
              item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0));
          return {
            ...item,
            quantity,
            totalPrice: basePrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
