"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (medicineId: string, pharmacyId: string) => void;
  updateQuantity: (medicineId: string, pharmacyId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.medicineId === newItem.medicineId && item.pharmacyId === newItem.pharmacyId
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.medicineId === newItem.medicineId && item.pharmacyId === newItem.pharmacyId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (medicineId: string, pharmacyId: string) => {
    setItems(prevItems =>
      prevItems.filter(item =>
        !(item.medicineId === medicineId && item.pharmacyId === pharmacyId)
      )
    );
  };

  const updateQuantity = (medicineId: string, pharmacyId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId, pharmacyId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.medicineId === medicineId && item.pharmacyId === pharmacyId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
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