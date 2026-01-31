import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartSidebar from '../components/common/CartSidebar';

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const Content = styled.main`
  flex: 1; 
`;

export default function MainLayout() {
  return (
    <Wrap>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
      <CartSidebar />
    </Wrap>
  );
}