import { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '@/types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      userId: '1',
      items: [],
      totalAmount: 45.97,
      deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
      status: 'delivered',
      createdAt: new Date('2024-03-10'),
    },
    {
      id: '2',
      userId: '1',
      items: [],
      totalAmount: 28.98,
      deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
      status: 'preparing',
      createdAt: new Date('2024-03-12'),
    },
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
