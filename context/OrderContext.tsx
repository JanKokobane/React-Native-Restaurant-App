import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Text } from 'react-native';
import { Order } from '@/types';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.id), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>),
        }));

        setOrders(fetched);
        setError(null);
      },
      (err) => {
        console.error('Orders snapshot error:', err);
        setError(err.message);
        setOrders([]);
      }
    );

    return () => unsubscribe();
  }, [user?.id]); 

  const addOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt'>
  ) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    await addDoc(collection(db, 'orders'), {
      ...orderData,
      userId: user.id, 
      createdAt: serverTimestamp(),
    });
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
      {error && (
        <Text style={{ color: 'red', padding: 8 }}>
          ⚠️ Orders error: {error}
        </Text>
      )}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
}
