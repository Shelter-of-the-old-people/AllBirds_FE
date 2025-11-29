// src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.items || []);
      const total = res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (err) {
      console.error("장바구니 조회 실패:", err);
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // [수정] selectedImage 인자 추가
  const addToCart = async (productId, size, quantity = 1, selectedImage) => {
    try {
      // API로 이미지 정보 함께 전송
      await api.post('/cart', { productId, size, quantity, selectedImage });
      await fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else {
        alert("장바구니 담기 실패");
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const checkout = async () => {
    try {
      await api.post('/orders');
      alert("주문이 완료되었습니다!");
      setCartItems([]);
      setCartCount(0);
      setIsCartOpen(false);
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      alert("주문 처리에 실패했습니다.");
    }
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider value={{ 
      cartItems, isCartOpen, cartCount, 
      setIsCartOpen, toggleCart, addToCart, 
      updateQuantity, removeFromCart, checkout, fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);