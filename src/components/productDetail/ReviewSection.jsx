import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../../api/axios';

const Wrapper = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  h2 { font-size: 1.5rem; font-weight: 700; }
`;

const ReviewForm = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const RatingSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  margin-bottom: 1rem;
`;

const SubmitBtn = styled.button`
  background-color: #212a2f;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewItem = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  
  .rating { color: #f5a623; font-weight: bold; margin-bottom: 0.5rem; }
  .user { font-weight: 700; margin-right: 0.5rem; font-size: 0.9rem; }
  .date { color: #888; font-size: 0.8rem; }
  .content { margin-top: 0.5rem; line-height: 1.4; }
`;

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("후기 로드 실패", err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("후기 내용을 입력해주세요.");

    try {
      await api.post('/reviews', {
        productId,
        rating: Number(rating),
        content
      });
      alert("후기가 등록되었습니다.");
      setContent("");
      fetchReviews(); 
    } catch (err) {
      alert(err.response?.data?.message || "후기 등록 실패");
    }
  };

  return (
    <Wrapper>
      <Header>
        <h2>구매 후기</h2>
        <span>({reviews.length}개)</span>
      </Header>

      {/* 후기 작성 영역 */}
      <ReviewForm>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>별점:</label>
          <RatingSelect value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">★★★★★ (5점)</option>
            <option value="4">★★★★ (4점)</option>
            <option value="3">★★★ (3점)</option>
            <option value="2">★★ (2점)</option>
            <option value="1">★ (1점)</option>
          </RatingSelect>
        </div>
        <TextArea 
          placeholder="이 제품을 구매하셨나요? 후기를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SubmitBtn onClick={handleSubmit}>후기 등록</SubmitBtn>
      </ReviewForm>

      <ReviewList>
        {reviews.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>아직 작성된 후기가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review._id}>
              <div className="rating">{'★'.repeat(review.rating)}</div>
              <div>
                <span className="user">{review.userId?.name || '익명'}</span>
                <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="content">{review.content}</p>
            </ReviewItem>
          ))
        )}
      </ReviewList>
    </Wrapper>
  );
}