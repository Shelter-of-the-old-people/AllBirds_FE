import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layout/MainLayout'; 

import MainPage from './pages/MainPage'; 
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<MainPage />} />
              
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            
            <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
          </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;