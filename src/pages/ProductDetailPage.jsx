import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/axios';

import ProductInfo from '../components/productDetail/ProductInfo';
import ReviewSection from '../components/productDetail/ReviewSection';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

export default function ProductDetailPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("상품 정보 로드 실패", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Container>로딩 중...</Container>;
  if (!product) return <Container>상품을 찾을 수 없습니다.</Container>;

  return (
    <Container>
      <ProductInfo product={product} />

      <ReviewSection productId={id} />
    </Container>
  );
}