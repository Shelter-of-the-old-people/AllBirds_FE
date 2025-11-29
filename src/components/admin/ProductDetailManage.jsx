import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const DetailContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const BackButton = styled.button`
  background: #eee;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover { background: #ddd; }
`;

// [신규] 날짜 필터 스타일
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f1f3f5;
  border-radius: 8px;

  label { font-weight: bold; font-size: 0.9rem; margin-right: 0.5rem; }
  input[type="date"] { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
  button {
    background-color: #212a2f;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    &:hover { background-color: #000; }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const StatBox = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #eee;
  
  h4 { margin-top: 0; color: #555; font-size: 1rem; }
  p { font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0 0; color: #212a2f; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label { font-weight: bold; font-size: 0.9rem; }
  input { padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; }
`;

const SectionTitle = styled.h4`
  margin-top: 3rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #212a2f;
  border-left: 4px solid #212a2f;
  padding-left: 10px;
`;

export default function ProductDetailManage({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState({ revenue: 0, count: 0 });
  const [formData, setFormData] = useState({ discountRate: 0, availableSizes: '' });
  
  // [신규] 날짜 상태 관리
  const [dates, setDates] = useState({ start: '', end: '' });

  // 1. 상품 상세 정보 불러오기 (한 번만 실행)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${productId}`)
      .then(res => {
        setProduct(res.data);
        setFormData({
          discountRate: res.data.discountRate,
          availableSizes: res.data.availableSizes.join(',')
        });
      })
      .catch(err => console.error(err));
  }, [productId]);

  // 2. 판매 통계 불러오기 (함수로 분리하여 재사용)
  const fetchProductStats = useCallback(async () => {
    try {
      // 백엔드에 startDate, endDate 쿼리 전송
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        params: { 
          startDate: dates.start, 
          endDate: dates.end 
        },
        withCredentials: true 
      });

      // 전체 통계 배열에서 "현재 보고 있는 상품(productId)"의 통계만 찾음
      const myStat = res.data.find(item => item._id === productId);
      
      if (myStat) {
        setStats({ revenue: myStat.totalRevenue, count: myStat.totalQuantity });
      } else {
        // 해당 기간에 판매 내역이 없으면 0으로 초기화
        setStats({ revenue: 0, count: 0 });
      }
    } catch (err) {
      console.error(err);
      alert("통계 조회 실패");
    }
  }, [productId, dates]);

  // 처음 로딩 시 전체 통계 조회
  useEffect(() => {
    fetchProductStats();
  }, []); // 의존성 배열 비움 (최초 1회만 자동 실행, 이후는 조회 버튼으로 실행)

  // 수정 핸들러
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}`, {
        discountRate: formData.discountRate,
        availableSizes: formData.availableSizes 
      }, { withCredentials: true });
      
      alert('상품 정보가 수정되었습니다!');
      onBack();
    } catch (err) {
      console.error(err);
      alert('수정 실패');
    }
  };

  if (!product) return <div>로딩중...</div>;

  return (
    <DetailContainer>
      <Header>
        <h3>{product.name} 상세 관리</h3>
        <BackButton onClick={onBack}>← 목록으로</BackButton>
      </Header>

      {/* 1. 상단: 상품 정보 수정 영역 */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
        <img 
          src={`http://localhost:5000${product.images[0]}`} 
          alt={product.name} 
          style={{ width: '250px', borderRadius: '8px', border: '1px solid #eee' }} 
        />
        
        <div style={{ flex: 1 }}>
          <Form onSubmit={handleUpdate}>
            <InputGroup>
              <label>할인율 (%)</label>
              <input 
                type="number" 
                value={formData.discountRate} 
                onChange={(e) => setFormData({...formData, discountRate: e.target.value})} 
              />
            </InputGroup>
            <InputGroup>
              <label>가용 사이즈 (쉼표로 구분)</label>
              <input 
                type="text" 
                value={formData.availableSizes} 
                onChange={(e) => setFormData({...formData, availableSizes: e.target.value})} 
                placeholder="예: 250,260,270"
              />
            </InputGroup>
            <button type="submit" style={{ 
              marginTop: '1rem', padding: '1rem', background: '#212a2f', 
              color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold'
            }}>
              수정 사항 저장하기
            </button>
          </Form>
        </div>
      </div>

      {/* 2. 하단: 판매 현황 조회 영역 */}
      <SectionTitle>📊 이 상품의 판매 현황</SectionTitle>
      
      {/* [신규] 날짜 필터 바 */}
      <FilterContainer>
        <span>📅 조회 기간:</span>
        <input 
          type="date" 
          value={dates.start}
          onChange={(e) => setDates({ ...dates, start: e.target.value })}
        />
        <span>~</span>
        <input 
          type="date" 
          value={dates.end}
          onChange={(e) => setDates({ ...dates, end: e.target.value })}
        />
        <button onClick={fetchProductStats}>조회하기</button>
        <button onClick={() => {
          setDates({ start: '', end: '' });
          // 상태 초기화 후 바로 전체 조회 실행하려면 fetchProductStats() 호출 필요하나
          // 리액트 state 업데이트 비동기 특성상 여기선 날짜만 비우고
          // 사용자가 다시 조회 버튼 누르게 유도하거나 useEffect 활용
        }} style={{background: '#888', marginLeft: 'auto'}}>초기화</button>
      </FilterContainer>

      <InfoGrid>
        <StatBox>
          <h4>기간 내 판매 수량</h4>
          <p>{stats.count}개</p>
        </StatBox>
        <StatBox>
          <h4>기간 내 누적 매출</h4>
          <p>{stats.revenue.toLocaleString()}원</p>
        </StatBox>
      </InfoGrid>

    </DetailContainer>
  );
}