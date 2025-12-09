import { Link, useNavigate } from 'react-router-dom'; 
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; 

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 80px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: sticky; /* 상단 고정 */
  top: 0;
  z-index: 1000;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  
  a {
    text-decoration: none;
    color: #212a2f;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  a {
    text-decoration: none;
    color: #212a2f;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.9rem;

    &:hover {
      color: #ddd; /* hover 효과 */
    }
  }

  /* 반응형: 모바일에서는 숨김 (추후 햄버거 메뉴 구현 예정) */
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  a {
    text-decoration: none;
    color: #212a2f;
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #212a2f;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartButton = styled.button`
  font-size: 0.9rem;
  font-weight: bold;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  
  span.badge {
    background: #212a2f;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 4px;
    vertical-align: top;
  }
`;

export default function Header() {
  const { toggleCart, cartCount, fetchCart } = useCart(); 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃 되었습니다.");
      
      await fetchCart();
      
      navigate('/login');
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };

  return (
    <HeaderWrapper>
      <Logo>
        <Link to="/">Allbirds</Link>
      </Logo>

      <Nav>
        <Link to="/products">슈퍼 블랙 프라이데이</Link>
        <Link to="/products">매장 위치</Link>
        <Link to="/products">지속 가능성</Link>
      </Nav>

      <UserActions>
        {user ? (
          <>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>
              <b>{user.name}</b>님
            </span>
            {user.isAdmin && <Link to="/admin">관리자</Link>}
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </>
        ) : (
          <Link to="/login">로그인</Link>
        )}

        <CartButton onClick={toggleCart}>
          장바구니
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </CartButton>
      </UserActions>
    </HeaderWrapper>
  );
}