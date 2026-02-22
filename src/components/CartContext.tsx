import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  promoCode: string;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; selectedVariants: Record<string, string> }
  | { type: 'REMOVE_ITEM'; productId: string; selectedVariants: Record<string, string> }
  | { type: 'UPDATE_QUANTITY'; productId: string; selectedVariants: Record<string, string>; quantity: number }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'CLEAR_CART' };

const cartKey = (productId: string, variants: Record<string, string>) =>
  `${productId}__${Object.values(variants).sort().join('_')}`;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = cartKey(action.product.id, action.selectedVariants);
      const existing = state.items.findIndex(
        i => cartKey(i.productId, i.selectedVariants) === key
      );
      if (existing >= 0) {
        const items = [...state.items];
        items[existing] = { ...items[existing], quantity: items[existing].quantity + action.quantity };
        return { ...state, items };
      }
      return {
        ...state,
        items: [...state.items, { productId: action.product.id, product: action.product, quantity: action.quantity, selectedVariants: action.selectedVariants }],
      };
    }
    case 'REMOVE_ITEM': {
      const key = cartKey(action.productId, action.selectedVariants);
      return { ...state, items: state.items.filter(i => cartKey(i.productId, i.selectedVariants) !== key) };
    }
    case 'UPDATE_QUANTITY': {
      const key = cartKey(action.productId, action.selectedVariants);
      return {
        ...state,
        items: state.items.map(i =>
          cartKey(i.productId, i.selectedVariants) === key ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      };
    }
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code, discount: action.code === 'INFINITY10' ? 10 : 0 };
    case 'CLEAR_CART':
      return { items: [], promoCode: '', discount: 0 };
    default:
      return state;
  }
}

const initialState: CartState = { items: [], promoCode: '', discount: 0 };

function loadCart(): CartState {
  try {
    const saved = localStorage.getItem('infinity-cart');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem('infinity-cart', JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = Math.round(subtotal * (state.discount / 100));
  const total = subtotal - discountAmount;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, subtotal, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
