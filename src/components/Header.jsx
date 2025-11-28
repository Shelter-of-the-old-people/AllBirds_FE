import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 1. 스타일 정의 (Styled Components)
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
  
  a {
    text-decoration: none;
    color: #212a2f;
    font-size: 0.9rem;
  }
`;

// 2. 컴포넌트 구현
export default function Header() {
  return (
    <HeaderWrapper>
      {/* 로고 영역 */}
      <Logo>
        <Link to="/">Allbirds</Link>
      </Logo>

      {/* 메뉴 영역 */}
      <Nav>
        <Link to="/men">슈퍼 블랙 프라이데이</Link>
        <Link to="/women">매장 위치</Link>
        <Link to="/kids">지속 가능성</Link>
      </Nav>

      {/* 유저 액션 영역 (로그인, 장바구니) */}
      <UserActions>
        <Link to="/login">로그인</Link>
        <Link to="/cart">장바구니</Link>
      </UserActions>
    </HeaderWrapper>
  );
}