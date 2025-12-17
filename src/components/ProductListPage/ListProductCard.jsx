import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/* --- 스타일 정의 --- */

/* [신규] 카드의 원래 자리를 확보하는 투명 컨테이너 */
const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.$height ? `${props.$height}px` : 'auto'};
  
  /* 1. 평소 상태 (마우스 뗐을 때) */
  z-index: 1;
  /* z-index가 1로 돌아오는 것을 0.3초 지연시킴 (애니메이션이 0.2초니까 그보다 조금 길게) */
  transition: z-index 0s linear 0.3s; 

  /* 2. 호버 상태 (마우스 올렸을 때) */
  &:hover {
    z-index: 100;
    /* 호버 시에는 지연 없이 즉시 앞으로 튀어나와야 함 */
    transition-delay: 0s;
  }
`;

/* [수정] 실제 카드 UI (이제 공중에 뜸) */
const CardContainer = styled.div`
  position: absolute; /* absolute로 변경하여 주변 밀림 방지 */
  top: 0;
  left: 0;
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  border-radius: 8px;
  
  /* 평소에는 패딩 없음 */
  padding: 0;
  
  /* 부드러운 전환 효과 */
  transition: all 0.2s ease-in-out; 

  /* CardWrapper에 마우스를 올렸을 때 스타일 변경 */
  ${CardWrapper}:hover & {
    padding: 20px;       
    margin: -20px; /* 상하좌우로 확장을 위한 마진 음수 처리 */
    width: calc(100% + 40px); /* 너비 확장 */
    
    /* 입체감을 위한 그림자 추가 */
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    transform: translateY(-5px); 
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  background-color: #f4f4f4;
  border-radius: 0; 
  overflow: hidden;
  aspect-ratio: 1 / 1; 
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`;

const ColorSelectorWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 4px 0;
  width: 100%;
`;

const ColorSelector = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: hidden; 
  scroll-behavior: smooth;
  flex: 1;
  width: 0;
`;

const ColorThumb = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${props => props.$selected ? '#212121' : 'transparent'};
  opacity: ${props => props.$selected ? 1 : 0.6};
  flex-shrink: 0;
  object-fit: cover;
  
  &:hover { opacity: 1; }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 10px;
  color: #212121;
  
  &.prev { left: -6px; }
  &.next { right: -6px; }

  &:hover { background: white; border-color: #212121; }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #212121;
  margin: 0;
`;

const ProductDesc = styled.p`
  font-size: 13px;
  color: #555;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
`;

const DiscountRate = styled.span` color: #d32f2f; `;
const CurrentPrice = styled.span` color: #212121; `;
const OriginalPrice = styled.span`
  color: #9e9e9e;
  font-weight: 400;
  font-size: 12px;
  text-decoration: line-through;
`;

/* 사이즈 박스 컨테이너 */
const SizeBoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  
  /* 숨김 처리 */
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  margin-top: 0;
  pointer-events: none;
  
  /* 애니메이션 */
  transition: all 0.3s ease-in-out;

  /* CardWrapper에 호버 시 표시 (이벤트 트리거 변경) */
  ${CardWrapper}:hover & {
    max-height: 200px;
    opacity: 1;
    margin-top: 8px;
    pointer-events: auto;
  }
`;

const SizeBox = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${props => props.$available ? '#212121' : '#ccc'};
  border: 1px solid ${props => props.$available ? '#212121' : '#e0e0e0'};
  position: relative;
  background-color: white;
  
  ${props => !props.$available && `
    background-color: #f9f9f9;
    &::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(to top left, transparent 48%, #e0e0e0 49%, #e0e0e0 51%, transparent 52%);
    }
  `}
`;

// 이미지 URL 처리 헬퍼
const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/300?text=No+Image';
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
};

const ListProductCard = ({ product }) => {
  // [수정] product가 없으면 아무것도 렌더링하지 않음
  if (!product) return null;

  const images = product.images || [];
  
  // Hooks
  const [selectedImg, setSelectedImg] = useState(images.length > 0 ? images[0] : null); 
  const scrollRef = useRef(null);
  const navigate = useNavigate(); 
  
  // [추가] 카드 높이 측정을 위한 ref와 state
  const cardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (images.length > 0) setSelectedImg(images[0]);
  }, [product.id, images]);

  // [추가] 렌더링 직후 카드의 실제 높이를 측정하여 Wrapper에 적용
  useLayoutEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [product]);

  const showNavButtons = images.length >= 7;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleInteractiveClick = (e) => {
    e.stopPropagation();
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    // 1. Wrapper로 감싸서 공간 확보
    <CardWrapper $height={cardHeight} onClick={handleCardClick}>
      
      {/* 2. 실제 카드는 absolute로 띄우고 ref 연결 */}
      <CardContainer ref={cardRef}>
        
        {/* 메인 이미지 */}
        <ImageSection>
          <MainImage src={getImageUrl(selectedImg)} alt={product.name} />
        </ImageSection>
        
        {/* 썸네일 슬라이더 */}
        <ColorSelectorWrapper onClick={handleInteractiveClick}>
          {showNavButtons && (
            <NavButton className="prev" onClick={() => handleScroll('left')}>&lt;</NavButton>
          )}

          <ColorSelector ref={scrollRef}>
            {images.map((img, idx) => (
              <ColorThumb 
                key={idx} 
                src={getImageUrl(img)} 
                $selected={selectedImg === img}
                onClick={() => setSelectedImg(img)} 
                alt={`${product.name} color ${idx}`}
              />
            ))}
          </ColorSelector>

          {showNavButtons && (
            <NavButton className="next" onClick={() => handleScroll('right')}>&gt;</NavButton>
          )}
        </ColorSelectorWrapper>

        {/* 정보 */}
        <InfoSection>
          <ProductName>{product.name}</ProductName>
          <ProductDesc>기본 색상</ProductDesc>
          <ProductCategory>
            {product.category} {product.material ? `| ${product.material}` : ''}
          </ProductCategory>
        </InfoSection>

        {/* 가격 */}
        <PriceSection>
          {product.isSale && <DiscountRate>{product.discountRate}%</DiscountRate>}
          <CurrentPrice>₩{product.price.toLocaleString()}</CurrentPrice>
          {product.isSale && (
            <OriginalPrice>₩{product.originalPrice.toLocaleString()}</OriginalPrice>
          )}
        </PriceSection>

        {/* 사이즈 (Wrapper 호버 시 노출됨) */}
        <SizeBoxContainer>
          {product.stock && Object.keys(product.stock).map(size => {
            const isAvailable = product.stock[size];
            return (
              <SizeBox key={size} $available={isAvailable}>
                {size}
              </SizeBox>
            );
          })}
        </SizeBoxContainer>
      </CardContainer>
    </CardWrapper>
  );
};

export default ListProductCard;