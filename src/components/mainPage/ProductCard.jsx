// src/components/ProductCard.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- [핵심 추가] 이미지 경로 변환 함수 ---
// 로컬 경로(/uploads)인 경우 백엔드 주소를 붙여주고, 외부 링크(http)는 그대로 둡니다.
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image'; // 이미지가 없을 때 대체 이미지
  
  // 외부 링크(https://...)는 그대로 반환
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // 로컬 파일(/uploads/...)은 백엔드 서버 주소(http://localhost:5000)를 붙임
  // ※ 만약 백엔드 포트가 5000이 아니라면 여기를 수정하세요.
  return `http://localhost:5000${imagePath}`;
};

// --- Styled Components (기존 스타일 유지) ---

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  cursor: pointer;
  
  a {
    text-decoration: none;
    color: inherit;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;       /* [수정] 부모 컨테이너에 맞춤 */
  padding-top: 100%; /* 1:1 정사각형 */
  background-color: #f5f5f5;
  overflow: hidden;
  margin-bottom: 15px;
  border-radius: 8px; /* 둥근 모서리 복구 권장 (선택사항) */

  img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover; /* [수정] contain보다 cover가 꽉 차게 보여서 예쁨 */
    /* mix-blend-mode: multiply; -> 배경이 흰색이 아니면 이미지가 어두워질 수 있어 제거 고려 */
    transition: transform 0.3s ease;
  }
`;

const RankBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 35px;
  height: 35px;
  background-color: #212a2f;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border-radius: 4px;
`;

const InfoArea = styled.div`
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #212a2f;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductColor = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin: 0;
`;

const Price = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: #212a2f;
  margin: 5px 0;
`;

const SizeSection = styled.div``;

const SizeLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: #212a2f;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const SizeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SizeBox = styled.span`
  font-size: 0.8rem;
  color: #212a2f;
  border: 1px solid #e0e0e0;
  background-color: #e5e7eb; /* 오타 수정: e5e7eb -> #e5e7eb */
  padding: 4px 4px;
  min-width: 28px; /* 최소 너비 지정 */
  text-align: center;
  transition: all 0.2s;

  &:hover {
    border-color: #212a2f;
    color: #212a2f;
    background-color: #f9f9f9;
  }
`;

export default function ProductCard({ item }) {
  if (!item) return null;

  // [핵심 수정] 
  // 1. item.image(문자열)가 있으면 쓰고, 없으면 item.images(배열)의 첫 번째를 씁니다.
  const rawImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
  
  // 2. getImageUrl 함수를 통해 http://localhost:5000을 붙인 최종 URL을 만듭니다.
  const imageUrl = getImageUrl(rawImage);

  // [추가] availableSizes 처리 (DB 필드명 매칭)
  // item.sizes가 있으면 쓰고, 없으면 item.availableSizes를 씁니다.
  const sizeList = item.sizes || item.availableSizes || [];

  return (
    <CardWrapper>
      {/* id가 있으면 링크 연결 */}
      <Link to={`/products/${item.id || item._id}`}>
        <ImageArea>
          {item.rank && <RankBadge>{item.rank}</RankBadge>}
          {/* src에 변환된 imageUrl 사용 */}
          <img src={imageUrl} alt={item.name} />
        </ImageArea>

        <InfoArea>
          <ProductName>{item.name}</ProductName>
          <ProductColor>{item.color || item.material}</ProductColor> {/* color가 없으면 material 표시 */}
          <Price>
            {/* 할인율이 있으면 할인가 계산해서 표시하는 로직 추가 가능 */}
             ₩{item.price ? item.price.toLocaleString() : 0}
          </Price>

          {sizeList.length > 0 && (
            <SizeSection>
              <SizeLabel>주문 가능 사이즈</SizeLabel>
              <SizeList>
                {sizeList.map((size, idx) => (
                  <SizeBox key={idx}>{size}</SizeBox>
                ))}
              </SizeList>
            </SizeSection>
          )}
        </InfoArea>
      </Link>
    </CardWrapper>
  );
}