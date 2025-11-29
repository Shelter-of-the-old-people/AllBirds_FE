import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StatsContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: flex-end;
`;

const StatResult = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  h4 { font-size: 1.5rem; margin-bottom: 1rem; }
  p { font-size: 1.2rem; margin: 0.5rem 0; }
`;

export default function SalesStats() {
  const [dates, setDates] = useState({ start: '', end: '' });
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        params: { startDate: dates.start, endDate: dates.end },
        withCredentials: true // 관리자 쿠키 전송
      });
      setStats(res.data); // 배열 형태로 옴
    } catch (err) {
      console.error(err);
      alert("데이터 조회 실패");
    }
  };

  // 총합 계산
  const totalRevenue = stats ? stats.reduce((acc, curr) => acc + curr.totalRevenue, 0) : 0;
  const totalCount = stats ? stats.reduce((acc, curr) => acc + curr.totalQuantity, 0) : 0;

  return (
    <StatsContainer>
      <FilterBar>
        <div>
          <label>시작일 </label>
          <input type="date" onChange={(e) => setDates({...dates, start: e.target.value})} />
        </div>
        <div>
          <label>종료일 </label>
          <input type="date" onChange={(e) => setDates({...dates, end: e.target.value})} />
        </div>
        <button onClick={fetchStats}>조회</button>
      </FilterBar>

      {stats && (
        <StatResult>
          <h4>📊 조회 결과</h4>
          <p>총 판매 수량: <strong>{totalCount}개</strong></p>
          <p>총 매출액: <strong>{totalRevenue.toLocaleString()}원</strong></p>
          
          <hr style={{margin: '20px 0'}}/>
          
          <h5>제품별 상세</h5>
          <ul>
            {stats.map((item, idx) => (
              <li key={idx}>
                {item.productName}: {item.totalQuantity}개 ({item.totalRevenue.toLocaleString()}원)
              </li>
            ))}
          </ul>
        </StatResult>
      )}
    </StatsContainer>
  );
}