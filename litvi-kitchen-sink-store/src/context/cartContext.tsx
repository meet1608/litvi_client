import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (product: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const CART_STORAGE_KEY = 'quartz_sink_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateCartItemId = (product: Omit<CartItem, 'quantity'>) => {
  return `${product.id}-${product.name}-${product.price}-${product.image}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    console.log('Cart updated:', cartItems);
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product);
      const existingItemIndex = prevItems.findIndex(item => generateCartItemId(item) === generateCartItemId(product));
  
      if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        return prevItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
  
      // Add new item with quantity 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  

  const removeFromCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product);
     return prevItems.filter(item => generateCartItemId(item) !== cartItemId)
    }
    );
  };

  const updateQuantity = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product);
      return;
    }

    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product);
      return prevItems.map(item =>
        generateCartItemId(item) === cartItemId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
