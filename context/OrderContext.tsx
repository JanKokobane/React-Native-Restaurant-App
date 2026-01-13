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
    if (!user?.uid) {
      setOrders([]);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
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
        console.error('Firestore onSnapshot error:', err);
        setError(err.message);
        setOrders([]);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addOrder = async (
    orderData: Omit<Order, 'id' | 'createdAt'>
  ) => {
    if (!user?.uid) return;

    try {
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        userId: user.uid,        
        createdAt: serverTimestamp(), 
      });
    } catch (err: any) {
      console.error('Add order error:', err);
      setError(err.message);
    }
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
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
