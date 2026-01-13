import { Timestamp } from 'firebase/firestore';

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
  image: string | undefined;
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  streetName: string;
  streetNumber: string;
  addressLine2?: string;
  fullAddress: string;
  username?: string;     
  joinedDate?: string;   
}


// export interface Order {
//   address: any;
//   total: any;
//   id: string;
//   userId: string;
//   items: CartItem[];
//   totalAmount: number;
//   deliveryAddress: string;
//   status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
//   createdAt: Date;
// }

export interface Order {
  id: string;
  createdAt: Date | Timestamp; 
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  total: number;
  userId: string;
  items: any[];
}


