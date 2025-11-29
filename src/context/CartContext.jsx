import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // 헤더 뱃지용
  const navigate = useNavigate();

  // 장바구니 조회 (로그인 상태일 때만 성공)
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.items || []);
      // 총 수량 계산
      const total = res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (err) {
      console.error("장바구니 조회 실패:", err);
      // 로그인이 안되어있으면 장바구니를 비움
      setCartItems([]);
      setCartCount(0);
    }
  };

  // 초기 로드 시 장바구니 조회
  useEffect(() => {
    fetchCart();
  }, []);

  // 장바구니 담기
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      await api.post('/cart', { productId, size, quantity });
      await fetchCart(); // 데이터 갱신
      setIsCartOpen(true); // 사이드바 열기
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate('/login');
      } else {
        alert("장바구니 담기 실패");
      }
    }
  };

  // 수량 변경
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 삭제
  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 결제 (주문 생성)
  const checkout = async () => {
    try {
      await api.post('/orders');
      alert("주문이 완료되었습니다!");
      setCartItems([]);
      setCartCount(0);
      setIsCartOpen(false);
      navigate('/mypage'); // 마이페이지로 이동
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

// Custom Hook
export const useCart = () => useContext(CartContext);