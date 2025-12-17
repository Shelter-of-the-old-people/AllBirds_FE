import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api, getImageUrl } from '../api/axios';
import HeroBanner from '../components/mainPage/HeroBanner';
import ProductCard from '../components/mainPage/ProductCard';
import RealTimePopular from '../components/mainPage/RealTimePopular';
import SustainabilitySection from '../components/mainPage/SustainabilitySection';
import EmailSubscription from '../components/mainPage/EmailSubscription';
import NewArrivals from '../components/mainPage/NewArrivals';

const Container = styled.div`
  width: 100%;
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
          discountRate: p.discountRate,
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
      {/* 1. Hero Banner 컴포넌트 재사용 */}
      <HeroBanner 
        bgImage="https://allbirds.co.kr/cdn/shop/files/blacksheep_dt_ac45895d-e31f-4b46-a9ed-754251e3d6a9_2560x.jpg?v=1763952872"
      />
      <RealTimePopular />

      <SustainabilitySection />
      
      <EmailSubscription />

      <NewArrivals />

      </Container>
  );
}