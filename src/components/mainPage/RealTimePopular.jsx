import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { api, getImageUrl } from '../../api/axios';

const SectionWrapper = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #212a2f;
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
  transform: translateX(calc(-${props => props.$index} * (20% + 4px))); 
`;

const ProductItem = styled.div`
  min-width: calc((100% - 80px) / 5); 
  flex-shrink: 0;
  background-color: #f9f9f9;
`;

const SlideButton = styled.button`
  position: absolute;
  top: calc(4rem + 10vw); 
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #ddd;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #212a2f;
  transition: all 0.2s;

  &:hover {
    background-color: #f7f7f7;
    border-color: #212a2f;
  }

  &:disabled {
    opacity: 0;
    cursor: default;
  }

  &.prev { left: 10px; }
  &.next { right: 10px; }
`;

export default function RealTimePopular() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const VISIBLE_COUNT = 5;

  useEffect(() => {
    api.get('/products/popular')
      .then(res => {
        const formattedData = res.data.map((item, index) => ({
          id: item._id, 
          name: item.name,
          price: item.price,
          image: getImageUrl(item.images?.[0]), 
          color: item.colors?.[0] || '기본 색상', 
          rank: index + 1,
          sizes: item.availableSizes
        }));
        setItems(formattedData);
      })
      .catch(err => console.error(err));
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
    </SectionWrapper>
  );
}