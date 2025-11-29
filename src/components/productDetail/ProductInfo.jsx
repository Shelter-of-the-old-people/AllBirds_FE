import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api, getImageUrl } from '../../api/axios';
import { useCart } from '../../context/CartContext';

// --- Styled Components (High Fidelity Design) ---

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 60px; /* 좌우 간격 넓게 */
  margin-bottom: 80px;
  justify-content: center;

  @media (max-width: 960px) {
    flex-direction: column;
    gap: 40px;
  }
`;

// [좌측] 이미지 영역
const ImageSection = styled.div`
  flex: 1.2;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MainImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; /* 정사각형 비율 유지 */
  background-color: #f3f3f3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지 꽉 차게 */
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05); /* 마우스 오버 시 살짝 확대 */
  }
`;

const ThumbnailList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#212a2f' : 'transparent'};
  opacity: ${props => props.$active ? 1 : 0.6};
  transition: all 0.2s;

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// [우측] 정보 영역
const InfoSection = styled.div`
  flex: 1;
  min-width: 300px;
  padding-top: 10px;
`;

// 빵부스러기 경로 (Breadcrumb) - 예: Men / Shoes
const Breadcrumb = styled.div`
  font-size: 0.9rem;
  color: #767676;
  margin-bottom: 10px;
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #212a2f;
  margin-bottom: 10px;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
`;

const Price = styled.span`
  font-size: 1.25rem;
  color: #4a4a4a;
  font-weight: 500;
`;

// 별점 표시 (데코레이션)
const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  
  span.stars { color: #212a2f; } /* 검은 별 */
  span.count { color: #767676; text-decoration: underline; margin-left: 4px; }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #4a4a4a;
  margin-bottom: 30px;
`;

// 사이즈 선택 영역
const SizeSection = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #212a2f;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;

  span.guide {
    color: #767676;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
`;

const SizeButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: ${props => props.$selected ? '#212a2f' : '#fff'};
  color: ${props => props.$selected ? '#fff' : '#212a2f'};
  border: 1px solid ${props => props.$selected ? '#212a2f' : '#e0e0e0'};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #212a2f;
  }
`;

const AddToCartBtn = styled.button`
  width: 100%;
  height: 56px;
  background-color: #212a2f;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  
  /* 비활성화 상태 스타일 */
  opacity: ${props => props.$disabled ? 0.5 : 1};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background-color: ${props => props.$disabled ? '#212a2f' : '#3a4b53'};
  }
`;

const FreeShippingMsg = styled.div`
  margin-top: 16px;
  font-size: 0.85rem;
  color: #4a4a4a;
  text-align: center;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
`;

// 아코디언 메뉴 스타일
const AccordionWrapper = styled.div`
  margin-top: 40px;
  border-top: 1px solid #e0e0e0;
`;

const AccordionDetails = styled.details`
  border-bottom: 1px solid #e0e0e0;
  
  &[open] summary ~ * {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AccordionSummary = styled.summary`
  padding: 20px 0;
  font-weight: 700;
  color: #212a2f;
  font-size: 1.1rem;
  cursor: pointer;
  list-style: none; /* 기본 화살표 제거 */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 크롬 등 브라우저 기본 화살표 숨김 */
  &::-webkit-details-marker {
    display: none;
  }

  /* 커스텀 + 아이콘 */
  &::after {
    content: '+';
    font-size: 1.5rem;
    font-weight: 400;
    color: #212a2f;
  }

  /* 열려있을 때 - 아이콘으로 변경 */
  details[open] &::after {
    content: '-';
  }
`;

const AccordionContent = styled.div`
  padding-bottom: 20px;
  color: #4a4a4a;
  line-height: 1.6;
  font-size: 0.95rem;
`;


export default function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImgUrl, setMainImgUrl] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImgUrl(getImageUrl(product.images[0]));
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) return alert("사이즈를 선택해주세요.");
    addToCart(product._id, selectedSize, 1);
  };

  if (!product) return null;

  return (
    <Wrapper>
        <ImageSection>
            <MainImage>
            <img src={mainImgUrl} alt={product.name} />
            </MainImage>
            <AccordionWrapper>
                <AccordionDetails>
                    <AccordionSummary>상세 정보</AccordionSummary>
                    <AccordionContent>
                    {product.detail || "이 제품은 편안함과 스타일을 동시에 만족시키는 최고의 데일리 슈즈입니다. 천연 소재를 사용하여 통기성이 뛰어나며, 하루 종일 신어도 발이 피로하지 않습니다."}
                    </AccordionContent>
                </AccordionDetails>
                <AccordionDetails>
                    <AccordionSummary>지속 가능성</AccordionSummary>
                    <AccordionContent>
                    {product.sustainability || "우리는 탄소 발자국을 줄이기 위해 끊임없이 노력합니다. 이 제품은 재활용 소재와 친환경 공정을 통해 생산되었습니다."}
                    </AccordionContent>
                </AccordionDetails>
                <AccordionDetails>
                    <AccordionSummary>세탁 장법 및 취급시 주의사항</AccordionSummary>
                    <AccordionContent>
                    {product.sustainability || "우리는 탄소 발자국을 줄이기 위해 끊임없이 노력합니다. 이 제품은 재활용 소재와 친환경 공정을 통해 생산되었습니다."}
                    </AccordionContent>
                </AccordionDetails>
                <AccordionDetails>
                    <AccordionSummary>배송 및 반품</AccordionSummary>
                    <AccordionContent>
                    오후 2시 이전 주문 시 당일 출고됩니다. 착용 후에도 30일 이내라면 언제든지 무료 반품이 가능합니다. (단, 훼손 시 제외)
                    </AccordionContent>
                </AccordionDetails>
            </AccordionWrapper>
      </ImageSection>

      <InfoSection>
        <Title>{product.name}</Title>
        <PriceRow>
            <Price>₩{product.price.toLocaleString()}</Price>
        </PriceRow>

        <Description>{product.description}</Description>

        <ThumbnailList>
          {product.images?.map((img, idx) => {
            const fullUrl = getImageUrl(img);
            return (
              <Thumbnail 
                key={idx} 
                $active={fullUrl === mainImgUrl}
                onClick={() => setMainImgUrl(fullUrl)}
              >
                <img src={fullUrl} alt={`thumb-${idx}`} />
              </Thumbnail>
            );
          })}
        </ThumbnailList>

        {/* 사이즈 선택 */}
        <SizeSection>
          <Label>
            사이즈 선택
          </Label>
          <SizeGrid>
            {product.availableSizes?.map((size) => (
              <SizeButton 
                key={size}
                $selected={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizeButton>
            ))}
          </SizeGrid>
        </SizeSection>

        {/* 장바구니 버튼: 사이즈 미선택 시 흐리게 보이도록 처리 */}
        <AddToCartBtn 
            onClick={handleAddToCart}
            $disabled={!selectedSize}
            disabled={!selectedSize}
        >
            {selectedSize ? `장바구니 담기 - ₩${product.price.toLocaleString()}` : '사이즈를 선택해주세요'}
        </AddToCartBtn>
        
        <FreeShippingMsg>
          무료 배송 및 30일 이내 무료 반품 제공
        </FreeShippingMsg>

        {/* 아코디언 메뉴 */}


      </InfoSection>
    </Wrapper>
  );
}