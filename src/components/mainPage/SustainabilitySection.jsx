import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Styled Components (기존 스타일 유지) ---

const SectionWrapper = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 350;
  margin-bottom: 2rem;
  color: #212a2f;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  
  background-color: #ffffff;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  max-height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  /* 카드에 마우스 올리면 이미지 확대 효과 */
  ${Card}:hover & img {
    transform: scale(1.03);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: flex-start;
  padding : 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  padding-left: 0.7rem;
  font-weight: 700;
  color: #212a2f;
  margin: 0;
`;

const CardDesc = styled.p`
  font-size: 1.3rem;
  padding-left: 0.5rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
  margin-bottom: 1rem;
`;

const LinkButton = styled(Link)`
  font-size: 1.1rem;
  font-weight: 350;
  width: 350px;
  text-align: center;
  /* align-items는 display: flex일 때만 작동하므로 display를 추가하거나 제거해도 됩니다.
     버튼 형태 유지를 위해 inline-block을 권장합니다. */
  display: inline-block; 
  margin: auto;
  color: #212a2f;
  text-decoration: none;
  border: 1px solid #212a2f;
  padding: 12px 20px;
  
  /* [수정됨] transition 문법 오류 수정 */
  /* 모든 속성(배경색, 글자색)이 0.3초 동안 부드럽게 변함 */
  transition: all 0.3s ease;

  /* [수정됨] 호버 시 스타일 */
  &:hover {
    background-color: #212a2f; /* 배경: 검은색 */
    color: #ffffff;            /* 글씨: 흰색 */
    /* opacity: 0.7; -> 투명도 효과는 제거 */
  }
`;

// --- Data (요청하신 데이터 하드코딩) ---
const sustainabilityData = [
  {
    id: 1,
    title: "ZQ 메리노 울",
    desc: "최상급 울 소재",
    image: "https://sfycdn.speedsize.com/4aadaad8-50d5-458f-88dd-2f364bf4d82e/allbirds.co.kr/cdn/shop/files/e38945873be459407bd1e541c9ad5041.jpg?v=1740387850&width=1110",
    linkUrl: "/materials/wool",
    buttonText: "더 알아보기"
  },
  {
    id: 2,
    title: "유칼립투스 나무",
    desc: "실크처럼 매끄러운 촉감",
    image: "https://sfycdn.speedsize.com/4aadaad8-50d5-458f-88dd-2f364bf4d82e/allbirds.co.kr/cdn/shop/files/d7fcf584905e3a719874b448d68aa0c8.jpg?v=1740387915&width=1110",
    linkUrl: "/materials/tree",
    buttonText: "더 알아보기"
  },
  {
    id: 3,
    title: "사탕수수",
    desc: "부드러운 SweetFoam®의 주 소재",
    image: "https://sfycdn.speedsize.com/4aadaad8-50d5-458f-88dd-2f364bf4d82e/allbirds.co.kr/cdn/shop/files/b4729b825b4d6790fb2e91d761ffaa28.jpg?v=1740387919&width=1110",
    linkUrl: "/materials/sugar",
    buttonText: "더 알아보기"
  }
];

// --- Component Implementation ---

export default function SustainabilitySection() {
  // useState, useEffect, axios 불필요 -> 바로 변수 데이터 사용

  return (
    <SectionWrapper>
      <Title>우리가 사용하는 소재</Title>
      
      <GridContainer>
        {sustainabilityData.map(item => (
          <Card key={item.id}>
            <ImageBox>
              <img src={item.image} alt={item.title} />
            </ImageBox>
            <TextContent>
              <CardTitle>{item.title}</CardTitle>
              <CardDesc>{item.desc}</CardDesc>
              
              <LinkButton to={item.linkUrl}>
                {item.buttonText}
              </LinkButton>
            </TextContent>
          </Card>
        ))}
      </GridContainer>
    </SectionWrapper>
  );
}