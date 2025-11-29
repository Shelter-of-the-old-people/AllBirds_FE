import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../api/axios';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0; right: 0;
  width: 400px;
  height: 100%;
  background: white;
  z-index: 2001;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 { font-size: 1.2rem; font-weight: 700; }
  button { font-size: 1.5rem; cursor: pointer; }
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 15px;

  img {
    width: 80px; height: 80px;
    object-fit: cover;
    border-radius: 4px;
    background: #f9f9f9;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; }
  .option { color: #666; font-size: 0.85rem; margin-bottom: 8px; }
  .price { font-weight: 600; }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;

  button {
    width: 24px; height: 24px;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem;
    &:hover { border-color: #333; }
  }
  span { font-size: 0.9rem; font-weight: 600; min-width: 20px; text-align: center; }
`;

const RemoveBtn = styled.button`
  color: #999;
  text-decoration: underline;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-top: 5px;
  &:hover { color: #333; }
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  background: #fcfcfc;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 1.1rem;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: #212a2f;
  color: white;
  font-weight: 700;
  border-radius: 4px;
  &:hover { opacity: 0.9; }
`;

const EmptyCart = styled.div`
  text-align: center;
  margin-top: 50px;
  color: #888;
`;

export default function CartSidebar() {
  const { 
    cartItems, isCartOpen, setIsCartOpen, 
    updateQuantity, removeFromCart, checkout 
  } = useCart();

  const totalPrice = cartItems.reduce((acc, item) => {
    if (!item.productId) return acc;
    const price = item.productId.price * (1 - (item.productId.discountRate || 0) / 100);
    return acc + (price * item.quantity);
  }, 0);

  return (
    <>
      <Overlay $isOpen={isCartOpen} onClick={() => setIsCartOpen(false)} />
      <Sidebar $isOpen={isCartOpen}>
        <Header>
          <h2>장바구니 ({cartItems.length})</h2>
          <button onClick={() => setIsCartOpen(false)}>&times;</button>
        </Header>

        <CartList>
          {cartItems.length === 0 ? (
            <EmptyCart>장바구니가 비어있습니다.</EmptyCart>
          ) : (
            cartItems.map(item => {
                if(!item.productId) return null;
                const product = item.productId;
                const realPrice = product.price * (1 - (product.discountRate || 0) / 100);

                // [수정] 저장된 이미지가 있으면 사용, 없으면(예전 데이터) 기본 이미지 사용
                const displayImage = item.selectedImage || getImageUrl(product.images?.[0]);

                return (
                  <CartItem key={item._id}>
                    {/* displayImage 사용 */}
                    <img src={displayImage} alt={product.name} />
                    <ItemInfo>
                      <div>
                        <div className="name">{product.name}</div>
                        <div className="option">Size: {item.size}</div>
                      </div>
                      <div className="price">₩{realPrice.toLocaleString()}</div>
                      <QuantityControl>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </QuantityControl>
                      <RemoveBtn onClick={() => removeFromCart(item._id)}>삭제</RemoveBtn>
                    </ItemInfo>
                  </CartItem>
                );
            })
          )}
        </CartList>

        {cartItems.length > 0 && (
          <Footer>
            <TotalRow>
              <span>총액</span>
              <span>₩{totalPrice.toLocaleString()}</span>
            </TotalRow>
            <CheckoutBtn onClick={checkout}>결제하기</CheckoutBtn>
          </Footer>
        )}
      </Sidebar>
    </>
  );
}