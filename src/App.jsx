// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import MainPage from './pages/MainPage'; // 추가된 부분

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} /> {/* 교체 */}
        <Route path="/men" element={<div>남자 상품 페이지</div>} />
        <Route path="/women" element={<div>여자 상품 페이지</div>} />
      </Route>
    </Routes>
  );
}

export default App;