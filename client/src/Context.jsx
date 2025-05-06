import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Context
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  // Store the cart details and also handle the total for stripe
  const [cartSummary, setCartSummary] = useState({
    items: [],
    subTotal: 0,
    tax: 0,
    shipping: 0,
    totalAmount: 0,
  });

  // Store the user
  const [user, setUser] = useState(null);

  // Fetch the user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/auth/account', {
        withCredentials: true,
      });
      setUser(data);
      await fetchCart();
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null); // Clear user state if not authenticated
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/cart', {
        withCredentials: true,
      });
      setCartSummary(data.cartSummary);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch the user and cart when the component mounts
  useEffect(() => {
    fetchUser(); // ← runs only once
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]); // ← runs when user changes

  return (
    <Context.Provider
      value={{
        cartSummary,
        setCartSummary,
        user,
        setUser,
        fetchUser,
        fetchCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};
