import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetailPage() {
  const { id } = useParams(); 
  return <div>상품 상세 페이지 (ID: {id})</div>;
}