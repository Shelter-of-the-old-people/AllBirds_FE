// src/components/HeroBanner.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BannerSection = styled.section`
  width: 100%;
  height: 900px;
  /* props로 전달받은 이미지를 배경으로 설정 */
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative; /* 자식 요소(버튼)의 기준점이 됩니다 */

  /* 배경 어둡게 처리 (텍스트 가독성) */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;

  h2 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    font-weight: 500;
  }
`;

// 우측 하단 버튼 그룹
const ButtonGroup = styled.div`
  position: absolute; /* 배너를 기준으로 절대 위치 지정 */
  bottom: 50px;       /* 아래에서 50px 띄움 */
  right: 50px;        /* 오른쪽에서 50px 띄움 */
  display: flex;
  gap: 1rem;
  z-index: 10;        /* 배경 오버레이보다 위에 올라오도록 설정 */
`;

// react-router-dom의 Link에 스타일 적용
const ActionButton = styled(Link)`
  background-color: #fff;
  color: #212a2f;
  padding: 0.75rem 2rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: bold;
  transition: background 0.3s;
  display: inline-block; /* Link는 a태그 기반이므로 block 속성 부여 */

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function HeroBanner({ title, subtitle, bgImage }) {
  return (
    <BannerSection $bgImage={bgImage}>
      <Content>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </Content>
      <ButtonGroup>
        {/* 클릭 시 /products 페이지로 이동 */}
        <ActionButton to="/products">남성 세일</ActionButton>
        <ActionButton>여성 세일</ActionButton>
      </ButtonGroup>
    </BannerSection>
  );
}