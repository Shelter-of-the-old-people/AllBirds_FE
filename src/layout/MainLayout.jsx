import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; // 아래에서 만들 예정

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1; /* 푸터가 바닥에 붙도록 */
`;

export default function MainLayout() {
  return (
    <Wrap>
      <Header />
      <Content>
        <Outlet /> {/* 여기에 MainPage 등 자식 라우트가 들어옵니다 */}
      </Content>
      <Footer />
    </Wrap>
  );
}