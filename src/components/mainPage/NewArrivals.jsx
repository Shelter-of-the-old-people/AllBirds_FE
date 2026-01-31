import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Styled Components ---

const SectionWrapper = styled.section`
  padding: 0rem 2rem 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #212a2f;
`;

/* 3등분 그리드 레이아웃 */
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  /* 모바일 반응형 */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 350px; /* 세로로 긴 이미지 비율 반영 */
  overflow: hidden;
  margin-bottom: 1.5rem;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${Card}:hover & img {
    transform: scale(1.03);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
`;

const ItemTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #212a2f;
  margin: 0;
`;

const ItemDesc = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 0;
  margin-bottom: 0.5rem;
`;

/* 밑줄 텍스트 버튼 스타일 (아까와 동일) */
const ShopButton = styled(Link)`
  font-size: 1rem;
  font-weight: 700;
  color: #212a2f;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 5px;
  transition: color 0.2s;

  &:hover {
    color: #555;
    text-decoration-color: #555;
  }
`;

// --- Data (하드코딩) ---
const newArrivalsData = [
  {
    id: 1,
    title: "매일 경험하는 편안함",
    desc: "올버는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼 자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 짧은 산책처럼 느껴집니다.",
    // 실제 보내주신 이미지와 유사한 올버즈 여성 런닝 이미지 URL
    image: "https://allbirds.co.kr/cdn/shop/files/25Q2_BAU_Site_OurStoryLandingPage_Story-Carousel-08_Studio_Desktop_1x1_eaa761e1-229c-45c0-b96b-49c0fff1345c.webp?v=1753408340&width=900"
  },
  {
    id: 2,
    title: "지속 가능한 발걸음",
    desc: "소재를 고르는 순간부터 신발이 당신에게 닿는 그 순간까지 지구에 남기는 흔적을 헤아립니다. 탄소 발자국을 제로에 가깝게 줄이려는 노력에 동참해주세요.",
    // 실제 보내주신 이미지와 유사한 올버즈 남성 런닝 이미지 URL
    image: "https://allbirds.co.kr/cdn/shop/files/25Q1_Moonshot_Site_LandingPage_600x501_P2.png?v=1742523878&width=900"
  },
  {
    id: 3,
    title: "지구에서 온 소재",
    desc: "올버즈는 가능한 모든 곳에서 석유 기반 합성소재를 천연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 부드럽고 통기성이 좋습니다.",
    // 3번째 칸을 채우기 위한 골프/액티비티 이미지
    image: "https://allbirds.co.kr/cdn/shop/files/25Q2_BAU_Site_OurStoryLandingPage_Story-Carousel-04_Studio_Desktop_2x3_e8297425-4182-45c0-bf21-cbf7a4f5293d.webp?v=1753408471&width=900"
  }
];

// *이미지 URL이 깨질 경우를 대비해 placeholder 이미지를 사용할 수도 있습니다.
// 현재는 예시 URL이므로 실제 올버즈 CDN 주소나 로컬 이미지를 넣으시면 됩니다.

// --- Component Implementation ---

export default function NewArrivals() {
  return (
    <SectionWrapper>
      <GridContainer>
        {newArrivalsData.map(item => (
          <Card key={item.id}>
            <ImageBox>
              {/* 실제 이미지가 없으면 placeholder(회색박스)가 보일 수 있습니다. */}
              <img 
                src={item.image} 
                alt={item.title} 
              />
            </ImageBox>
            <TextContent>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDesc>{item.desc}</ItemDesc>
              
              <ShopButton to={item.linkUrl}>
                {item.btnText}
              </ShopButton>
            </TextContent>
          </Card>
        ))}
      </GridContainer>
    </SectionWrapper>
  );
}