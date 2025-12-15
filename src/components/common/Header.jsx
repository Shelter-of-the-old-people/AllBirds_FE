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
  position: sticky; 
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
      color: #ddd; 
    }
  }

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

const UserIconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212a2f;
  margin-right: 5px;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    display: block;
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
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }

  span.badge {
    position: absolute;
    bottom: -2px;
    right: -4px;
    background: #212a2f;
    color: white;
    font-size: 0.6rem;
    font-weight: bold;
    min-width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    border: 1px solid #fff;
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

  const isAdmin = user?.isAdmin;

  return (
    <HeaderWrapper>
      <Logo>
        <Link to="/">Allbirds</Link>
      </Logo>

      <Nav>
        <Link to="/men">슈퍼 블랙 프라이데이</Link>
        <Link to="/women">매장 위치</Link>
        <Link to="/kids">지속 가능성</Link>
      </Nav>

      <UserActions>
        {user ? (
          <>
            <UserIconLink 
              to={isAdmin ? "/admin" : "/mypage"} 
              aria-label={isAdmin ? "관리자 페이지" : "마이페이지"}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.6666 22.8333C21.6666 21.3215 21.6666 19.4822 21.4801 18.8671C21.0599 17.4822 19.9762 16.3984 18.5912 15.9783C17.9761 15.7917 17.2202 15.7917 15.7083 15.7917H10.2917C8.77979 15.7917 8.02385 15.7917 7.40874 15.9783C6.02381 16.3984 4.94002 17.4822 4.51991 18.8671C4.33331 19.4822 4.33331 21.3215 4.33331 22.8333M17.875 8.125C17.875 10.8174 15.6924 13 13 13C10.3076 13 8.12498 10.8174 8.12498 8.125C8.12498 5.43261 10.3076 3.25 13 3.25C15.6924 3.25 17.875 5.43261 17.875 8.125Z" stroke="#212121" strokeWidth="1.5" fill="none" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </UserIconLink>

            {user.isAdmin && <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>}
          </>
        ) : (
            <UserIconLink 
              to="/login" 
              aria-label="로그인 페이지"
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.6666 22.8333C21.6666 21.3215 21.6666 19.4822 21.4801 18.8671C21.0599 17.4822 19.9762 16.3984 18.5912 15.9783C17.9761 15.7917 17.2202 15.7917 15.7083 15.7917H10.2917C8.77979 15.7917 8.02385 15.7917 7.40874 15.9783C6.02381 16.3984 4.94002 17.4822 4.51991 18.8671C4.33331 19.4822 4.33331 21.3215 4.33331 22.8333M17.875 8.125C17.875 10.8174 15.6924 13 13 13C10.3076 13 8.12498 10.8174 8.12498 8.125C8.12498 5.43261 10.3076 3.25 13 3.25C15.6924 3.25 17.875 5.43261 17.875 8.125Z" stroke="#212121" strokeWidth="1.5" fill="none" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </UserIconLink>
        )}

        {!isAdmin && (
          <CartButton onClick={toggleCart} aria-label="장바구니 열기">
            <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.02456 5.9695V4.9756C7.02456 3.92121 7.44341 2.91 8.18898 2.16443C8.93455 1.41886 9.94576 1 11.0002 1C12.0546 1 13.0658 1.41886 13.8113 2.16443C14.5569 2.91 14.9758 3.92121 14.9758 4.9756V5.9695M20.4422 21.375V6.46645H1.55811V21.375H20.4422Z" stroke="#212121" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </CartButton>
        )}
      </UserActions>
    </HeaderWrapper>
  );
}