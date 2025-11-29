import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Layout from './components/common/Layout';

// Pages
import MainPage from './pages/MaeinPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      {/* Layout이 적용되는 라우트들 */}
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        
        {/* 상품 관련 */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        
        {/* 회원 관련 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        
        {/* 관리자 관련 */}
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      
      {/* 404 Not Found 처리 (필요 시 추가) */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
  );
}

export default App;