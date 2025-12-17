import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // [Main 기능] AuthContext 추가

// --- [애니메이션] ---
const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// --- [스타일 정의] ---
const HeaderWrapper = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  border-bottom: 1px solid #eee;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;
  height: 70px;
  position: relative;
  background: white;
  z-index: 1001;
`;

const BrandLogo = styled.img`
  height: 70px;        /* 로고 높이 설정 */
  width: auto;         /* 비율 유지 */
  display: block;      /* 블록 요소로 처리 */
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  height: 100%;
  align-items: center;

  a {
    text-decoration: none;
    color: #212a2f;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.9rem;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &:hover {
      color: #555;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 유저 액션 (아이콘 스타일) */
const UserActions = styled.div`
  display: flex;
  gap: 1.5rem; 
  align-items: center;
  
  /* 링크 및 버튼 공통 스타일 */
  a, button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  /* 아이콘 이미지 크기 */
  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.6;
    }
  }
`;

/* [Main 기능] 로그아웃 버튼 스타일 추가 */
const LogoutText = styled.button`
  font-size: 0.8rem;
  font-weight: 600;
  color: #767676;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: #212121;
  }
`;

/* 장바구니 버튼 (뱃지 위치 조정) */
const CartButton = styled.button`
  position: relative;
  
  span.badge {
    position: absolute;
    top: -6px;    
    right: -8px;  
    background: #212a2f;
    color: white;
    font-size: 0.65rem;
    padding: 2px 5px;
    border-radius: 10px;
    min-width: 16px;
    text-align: center;
    line-height: 1;
  }
`;

/* --- [서브 메뉴 스타일] (Horim 디자인 유지) --- */
const SubMenuContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  padding: 60px 150px 80px 150px;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 120px;
  
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 900;
`;

const MenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 120px;

  ${props => props.$isOpen && css`
    animation: ${slideRight} 0.5s ease forwards;
    opacity: 0;
  `}

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.25s; }
`;

const ColumnHeader = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #212121;
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 1px solid #212121;
  padding-left: 20px;
  list-style: none;
  margin: 0;
`;

const LinkItem = styled.li`
  font-size: 14px;
  color: #4a4a4a;
  cursor: pointer;
  line-height: 1.2;
  transition: color 0.2s;

  &:hover {
    color: #000;
    font-weight: 600;
  }
`;

// --- [컴포넌트 구현] ---
export default function Header() {
  const { toggleCart, cartCount, fetchCart } = useCart();
  const { user, logout } = useAuth(); // [Main 기능] Auth 훅 사용
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // [Main 기능] 로그아웃 핸들러
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

  // 아이콘 URL 상수 정의
  const ICONS = {
    search: "https://cdn-icons-png.flaticon.com/128/2319/2319177.png",
    // 로그인 안 했을 때 / 했을 때 동일한 아이콘 사용 (기능만 분기)
    user: "https://cdn-icons-png.flaticon.com/128/2815/2815428.png", 
    cart: "https://cdn-icons-png.flaticon.com/128/3034/3034002.png"
  };

  const isAdmin = user?.isAdmin;

  return (
    <HeaderWrapper onMouseLeave={closeMenu}>
      <NavContainer>
        {/* 로고 영역 */}
        <Link to="/">
          <BrandLogo 
            src="https://allbirds.co.kr/cdn/shop/files/allbirds-logo-fb.webp?v=1693932666" 
            alt="Allbirds Logo"
          />
        </Link>

        {/* 메뉴 영역 */}
        <Nav>
          <Link to="/men" onMouseEnter={closeMenu}>슈퍼 블랙 프라이데이</Link>
          <Link to="/women" onMouseEnter={closeMenu}>매장 위치</Link>
          
          <div 
            style={{height:'100%', display:'flex', alignItems:'center'}} 
            onMouseEnter={openMenu}
          >
            <Link to="/kids" style={{pointerEvents: 'none'}}>지속 가능성</Link>
          </div>
        </Nav>

        {/* 유저 액션 */}
        <UserActions>
          <Link to="/search" onMouseEnter={closeMenu}>
            <img src={ICONS.search} alt="검색" />
          </Link>
          
          {/* [병합된 로직] 로그인 여부에 따라 링크 변경 */}
          {user ? (
            <>
              {/* 로그인 상태: 마이페이지 or 관리자페이지 */}
              <Link 
                to={isAdmin ? "/admin" : "/mypage"} 
                onMouseEnter={closeMenu}
                title={isAdmin ? "관리자 페이지" : "마이페이지"}
              >
                <img src={ICONS.user} alt="마이페이지" />
              </Link>
              {/* 로그아웃 버튼 추가 */}
              <LogoutText onClick={handleLogout}>로그아웃</LogoutText>
            </>
          ) : (
            // 로그아웃 상태: 로그인 페이지
            <Link to="/login" onMouseEnter={closeMenu} title="로그인">
              <img src={ICONS.user} alt="로그인" />
            </Link>
          )}
          
          <CartButton onClick={toggleCart} onMouseEnter={closeMenu}>
            <img src={ICONS.cart} alt="장바구니" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </CartButton>
        </UserActions>

        {/* 서브 메뉴 (Horim 디자인) */}
        <SubMenuContainer $isOpen={isMenuOpen}>
          <MenuColumn $isOpen={isMenuOpen}>
            <ColumnHeader>올버즈</ColumnHeader>
            <LinkList>
              <LinkItem>브랜드 스토리</LinkItem>
              <LinkItem>지속 가능성</LinkItem>
              <LinkItem>소재</LinkItem>
              <LinkItem>수선</LinkItem>
            </LinkList>
          </MenuColumn>

          <MenuColumn $isOpen={isMenuOpen}>
            <ColumnHeader>스토리</ColumnHeader>
            <LinkList>
              <LinkItem>M0.0NSHOT</LinkItem>
              <LinkItem>올멤버스</LinkItem>
              <LinkItem>올버즈 앰배서더</LinkItem>
              <LinkItem>ReRun</LinkItem>
              <LinkItem>신발 관리 방법</LinkItem>
            </LinkList>
          </MenuColumn>

          <MenuColumn $isOpen={isMenuOpen}>
            <ColumnHeader>소식</ColumnHeader>
            <LinkList>
              <LinkItem>캠페인</LinkItem>
              <LinkItem>뉴스</LinkItem>
            </LinkList>
          </MenuColumn>
        </SubMenuContainer>
      </NavContainer>
    </HeaderWrapper>
  );
}