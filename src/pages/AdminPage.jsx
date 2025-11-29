import styled from 'styled-components';
import ProductManage from './components/ProductManage';

// 사이드바가 없어졌으므로 flex 관련 설정 제거
// 화면 전체 너비를 사용하되, 내용물이 너무 퍼지지 않게 max-width 설정
const AdminContainer = styled.div`
  min-height: calc(100vh - 180px); /* 헤더+푸터 제외 높이 */
  background-color: #f4f6f8;
  padding: 3rem 2rem; /* 위아래, 좌우 여백 */
`;

const ContentWrapper = styled.div`
  max-width: 1200px; /* 너무 넓게 퍼지지 않도록 최대 너비 제한 */
  margin: 0 auto;    /* 중앙 정렬 */
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #212a2f;
  border-bottom: 2px solid #ddd;
  padding-bottom: 1rem;
  font-size: 1.8rem;
`;

export default function AdminPage() {

  return (
    <AdminContainer>
      <ContentWrapper>
        <Title> 관리자 페이지</Title>
        <ProductManage />
      </ContentWrapper>
    </AdminContainer>
  );
}