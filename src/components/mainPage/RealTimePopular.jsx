import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ProductCard from './ProductCard'; // ProductCard 경로 확인 필요

// --- Styled Components ---

const SectionWrapper = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #212a2f;
`;

const SliderWrapper = styled.div`
  position: relative; 
  width: 100%;
`;

const SliderContainer = styled.div`
  overflow: hidden; 
  width: 100%;
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-${props => props.$index} * (100% / 5))); 
`;

const ProductItem = styled.div`
  /* (100% - (간격 20px * 4개)) / 5개 */
  min-width: calc((100% - 80px) / 5); 
  flex-shrink: 0;
  background-color: #f9f9f9;
`;

const SlideButton = styled.button`
  position: absolute;
  top: 140px; 
  transform: translateY(-50%);
  
  background-color: white;
  border: 1px solid #ddd;
  width: 45px;
  height: 45px;
  min-width: 45px; 
  min-height: 45px;
  
  border-radius: 50%;
  cursor: pointer;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #212a2f;
  transition: all 0.2s;

  &:hover {
    background-color: #212a2f;
    color: white;
    border-color: #212a2f;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #f0f0f0;
    color: #ccc;
    border-color: #ddd;
    
    &:hover {
      background-color: #f0f0f0;
      color: #ccc;
    }
  }

  &.prev { 
    left: -20px; 
  }
  
  &.next { 
    right: -20px; 
  }
`;

// --- Component Implementation ---

export default function RealTimePopular() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const VISIBLE_COUNT = 5;

  useEffect(() => {
    // 백엔드 API 호출
    axios.get('/api/products/popular')
      .then(res => {
        // [수정 핵심] 이미지 경로에 백엔드 주소(http://localhost:5000) 붙이기
        const rankedData = res.data.map((item, index) => {
          
          // item.images 배열을 순회하며 경로 수정
          const fixedImages = (item.images || []).map(img => {
            // 이미 http로 시작하면(외부 이미지) 그대로 두고,
            // / 로 시작하면(로컬 이미지) 백엔드 주소를 앞에 붙임
            if (img.startsWith('/')) {
              return `http://localhost:5000${img}`; 
            }
            return img;
          });

          return {
            ...item,
            id: item._id,   // MongoDB _id 매핑
            rank: index + 1, // 순위 추가
            images: fixedImages // 수정된 이미지 배열 덮어쓰기
          };
        });

        setItems(rankedData);
      })
      .catch(err => console.error("실시간 인기 데이터 로드 실패:", err));
  }, []);

  const nextSlide = () => {
    if (currentIndex + VISIBLE_COUNT < items.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <SectionWrapper>
      <Title>실시간 인기</Title>
      
      {items.length > 0 ? (
        <SliderWrapper>
          <SlideButton 
            className="prev" 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
          >
            ‹
          </SlideButton>
          
          <SlideButton 
            className="next" 
            onClick={nextSlide} 
            disabled={currentIndex + VISIBLE_COUNT >= items.length}
          >
            ›
          </SlideButton>

          <SliderContainer>
            <SliderTrack $index={currentIndex}>
              {items.map((item) => (
                <ProductItem key={item.id}>
                  <ProductCard item={item} />
                </ProductItem>
              ))}
            </SliderTrack>
          </SliderContainer>
        </SliderWrapper>
      ) : (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          실시간 인기 상품을 불러오는 중입니다...
        </p>
      )}
    </SectionWrapper>
  );
}