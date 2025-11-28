import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
// 분리한 컴포넌트 import
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import RealTimePopular from '../components/RealTimePopular';

const Container = styled.div`
  width: 100%;
`;

const Section = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #212a2f;
`;

const ProductList = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

export default function MainPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // json-server 데이터 호출
    axios.get('http://localhost:4000/products')
      .then(res => {
        const bestSellers = res.data.filter(p => p.category === 'best-seller');
        setProducts(bestSellers);
      })
      .catch(err => console.error("MainPage Error:", err));
  }, []);

  return (
    <Container>
      {/* 1. Hero Banner 컴포넌트 재사용 */}
      <HeroBanner 
        title="편안함, 그 이상의 가치"
        subtitle="자연에서 얻은 소재로 만들어진 최고의 편안함을 경험하세요."
        bgImage="https://cdn.allbirds.com/image/upload/f_auto,q_auto,w_1600/cms/3435t317X62Y35/345235.jpg"
      />

      {/* 2. Product List 섹션 */}
      <Section>
        <ProductList>
          {products.map(product => (
            /* ProductCard 컴포넌트 재사용 (props 전달) */
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductList>
        
      </Section>
      <RealTimePopular />
      
      
      {/* 3. (추가) Collections 섹션은 일단 그대로 두거나, 필요하면 별도 컴포넌트화 가능 */}
    </Container>
  );
}