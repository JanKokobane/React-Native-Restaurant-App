export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  sides?: string[];
  drinks?: DrinkOption[];
  extras?: ExtraOption[];
  removableIngredients?: string[];
}

export interface DrinkOption {
  id: string;
  name: string;
  price: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  selectedSides: string[];
  selectedDrink?: DrinkOption;
  selectedExtras: ExtraOption[];
  removedIngredients: string[];
  totalPrice: number;
  cartItemId: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: Date;
}
