import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [bagCount, setBagCount] = useState(0);
  const { user } = useAuth();

  // Fetch cart count when user logs in
  useEffect(() => {
    if (!user) {
      setBagCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const res = await api.get("/cart");
        const items = res.data.cart?.items || [];
        setBagCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } catch (err) {
        console.log(err);
      }
    };

    fetchCartCount();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart", { productId, quantity });
      const items = res.data.cart?.items || [];
      setBagCount(items.reduce((sum, item) => sum + item.quantity, 0));
      return res.data.cart;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const updateCartCount = (count) => {
    setBagCount(count);
  };

  return (
    <CartContext.Provider
      value={{
        bagCount,
        addToCart,
        updateCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
