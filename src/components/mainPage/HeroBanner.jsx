import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BannerSection = styled.section`
  width: 100%;
  height: 600px;
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

// ▼ [수정됨] 우측 하단으로 이동시키기 위한 스타일
const ButtonGroup = styled.div`
  position: absolute; /* 배너를 기준으로 절대 위치 지정 */
  bottom: 50px;       /* 아래에서 50px 띄움 */
  right: 50px;        /* 오른쪽에서 50px 띄움 */
  display: flex;
  gap: 1rem;
  z-index: 10;        /* 배경 오버레이보다 위에 올라오도록 설정 */

  }
`;

const ActionButton = styled(Link)`
  background-color: #fff;
  color: #212a2f;
  padding: 0.75rem 2rem;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: bold;
  transition: background 0.3s;

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
        <ActionButton to="/men">남성 세일</ActionButton>
        <ActionButton to="/women">여성 세일</ActionButton>
      </ButtonGroup>
    </BannerSection>
  );
}