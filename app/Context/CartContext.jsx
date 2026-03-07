"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContextBase";

const CART_STORAGE_KEY = "wemisk_cart";

const CartProviderInner = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persist to localStorage whenever cart changes, but ONLY after initialization
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isInitialized]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.item_id === item.item_id);
      if (existing) {
        return prev.map((it) =>
          it.item_id === item.item_id
            ? { ...it, attendees: it.attendees + item.attendees }
            : it,
        );
      }
      return [...prev, item];
    });
  }, []);

  const updateAttendees = useCallback((itemId, attendees) => {
    setItems((prev) =>
      prev.map((it) =>
        it.item_id === itemId
          ? { ...it, attendees: Number(attendees) || 1 }
          : it,
      ),
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((it) => it.item_id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subTotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.attendees || 0),
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateAttendees,
      removeItem,
      clearCart,
      subTotal,
    }),
    [items, addItem, updateAttendees, removeItem, clearCart, subTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const CartProvider = CartProviderInner;

export default CartProvider;
