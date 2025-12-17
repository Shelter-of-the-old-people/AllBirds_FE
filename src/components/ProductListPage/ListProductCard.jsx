  import React, { useState, useRef, useEffect } from 'react';
  import styled from 'styled-components';
  import { useNavigate } from 'react-router-dom';

  /* --- 스타일 정의 --- */

  const CardContainer = styled.div`
    position: relative;
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

    &:hover {
      /* Hover 시 흰색 패딩 생성 및 확장 효과 */
      padding: 20px;       
      margin: -20px;       
      width: calc(100% + 40px); 
      z-index: 100;        
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

    /* 호버 시 표시 */
    ${CardContainer}:hover & {
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
    // [수정] product가 없으면 아무것도 렌더링하지 않음 (안전장치)
    if (!product) return null;

    const images = product.images || [];
    // Hooks는 조건문 위에서 호출되어야 하므로 useState는 유지하되 초기값 설정 주의
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedImg, setSelectedImg] = useState(images.length > 0 ? images[0] : null); 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scrollRef = useRef(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate(); 

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (images.length > 0) setSelectedImg(images[0]);
    }, [product.id, images]);

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
      <CardContainer onClick={handleCardClick}>
        {/* 1. 메인 이미지 */}
        <ImageSection>
          <MainImage src={getImageUrl(selectedImg)} alt={product.name} />
        </ImageSection>
        
        {/* 2. 썸네일 슬라이더 */}
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

        {/* 3. 정보 */}
        <InfoSection>
          <ProductName>{product.name}</ProductName>
          <ProductDesc>{product.description}</ProductDesc>
          <ProductCategory>
            {product.category} {product.material ? `| ${product.material}` : ''}
          </ProductCategory>
        </InfoSection>

        {/* 4. 가격 */}
        <PriceSection>
          {product.isSale && <DiscountRate>{product.discountRate}%</DiscountRate>}
          <CurrentPrice>₩{product.price.toLocaleString()}</CurrentPrice>
          {product.isSale && (
            <OriginalPrice>₩{product.originalPrice.toLocaleString()}</OriginalPrice>
          )}
        </PriceSection>

        {/* 5. 사이즈 (평소엔 숨김, 호버 시 노출) */}
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
    );
  };

  export default ListProductCard;