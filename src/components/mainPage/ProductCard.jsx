import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Styled Components ---

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
  width: 100%;
  padding-top: 100%; /* 1:1 정사각형 */
  background-color: #f5f5f5;
  overflow: hidden;
  margin-bottom: 15px;

  img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
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

// [수정] 가격 영역 래퍼 (할인 시 가로 배치 등을 위해)
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
`;

// [수정] 최종 판매가 (할인가)
const FinalPrice = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: #212a2f;
  margin: 0;
`;

// [추가] 원가 (취소선)
const OriginalPrice = styled.span`
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
`;

// [추가] 할인율 (빨간색 강조)
const DiscountRate = styled.span`
  font-size: 0.85rem;
  color: #d32f2f;
  font-weight: 700;
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
  color: #555;
  border: 1px solid #e0e0e0;
  padding: 4px 8px;
  min-width: 32px;
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

  // 할인율이 있는지 확인 (0보다 크면 할인 중)
  const hasDiscount = item.discountRate && item.discountRate > 0;
  
  // 할인가 계산 (원가 * (1 - 할인율/100))
  const discountedPrice = hasDiscount 
    ? item.price * (1 - item.discountRate / 100) 
    : item.price;

  return (
    <CardWrapper>
      <Link to={`/products/${item.id}`}>
        <ImageArea>
          {item.rank && <RankBadge>{item.rank}</RankBadge>}
          <img src={item.image} alt={item.name} />
        </ImageArea>

        <InfoArea>
          <ProductName>{item.name}</ProductName>
          <ProductColor>{item.color}</ProductColor>
          
          {/* 가격 표시 로직 변경 */}
          <PriceRow>
            {hasDiscount ? (
              <>
                {/* 1. 할인율 */}
                <DiscountRate>{item.discountRate}%</DiscountRate>
                {/* 2. 최종 가격 (할인가) */}
                <FinalPrice>₩{Math.round(discountedPrice).toLocaleString()}</FinalPrice>
                {/* 3. 원가 (취소선) */}
                <OriginalPrice>₩{item.price.toLocaleString()}</OriginalPrice>
              </>
            ) : (
              // 할인이 없을 땐 그냥 가격만 표시
              <FinalPrice>₩{item.price ? item.price.toLocaleString() : 0}</FinalPrice>
            )}
          </PriceRow>

          {item.sizes && item.sizes.length > 0 && (
            <SizeSection>
              <SizeLabel>주문 가능 사이즈</SizeLabel>
              <SizeList>
                {item.sizes.map((size, idx) => (
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