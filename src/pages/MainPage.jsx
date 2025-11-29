import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api, getImageUrl } from '../api/axios';
import HeroBanner from '../components/mainPage/HeroBanner';
import ProductCard from '../components/mainPage/ProductCard';
import RealTimePopular from '../components/mainPage/RealTimePopular';

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
    api.get('/products') 
      .then(res => {
        const formatted = res.data.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image: getImageUrl(p.images?.[0]),
          color: 'Classic Color',
          sizes: p.availableSizes
        }));
        setProducts(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <HeroBanner 
        title="슈퍼 블랙 프라이데이"
        subtitle="연중 최대 혜택. UP TO 50% OFF."
        bgImage="https://allbirds.co.kr/cdn/shop/files/blacksheep_dt_ac45895d-e31f-4b46-a9ed-754251e3d6a9_1366x.jpg?v=1763952872"
      />
      <RealTimePopular />
    </Container>
  );
}