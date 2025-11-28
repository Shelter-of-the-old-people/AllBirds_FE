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
  /* radius 관련 코드 삭제됨 */
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

// [수정됨] 교수님이 주신 스타일 적용
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
  border-radius: 4px; /* 요청하신 대로 추가 */
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

const SizeSection = styled.div`
`;

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
          <Price>₩{item.price ? item.price.toLocaleString() : 0}</Price>

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