import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../../api/axios';

const SectionContainer = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AverageBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-end;
`;

const Average = styled.div`
  font-size: 48px;
  font-weight: 700; /* 숫자 좀 더 굵게 */
  color: #212a2f;
`;

const BigStar = styled.div`
  display:flex;
  flex-direction: column;
  font-size: 2rem;
  font-weight: 700;
  color: #212a2f;
  
  span.star {
    color: #ffae00ff; /* 별 색상 */
    margin-right: 5px;
    letter-spacing: -2px; /* 별 사이 간격 좁히기 */
  }
`;

const ReviewCount = styled.span`
  font-size: 0.9rem;
  margin-top: 5px;
  color: #666;
  font-weight: 400;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewItem = styled.div`
  padding: 2rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &:last-child {
    border-bottom: none;
  }
`;

const StarRating = styled.div`
  color: #ffae00ff; /* 개별 리뷰 별 색상도 통일 */
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const ReviewTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #212a2f;
  margin: 0;
`;

const MetaData = styled.div`
  font-size: 0.85rem;
  color: #888;
  display: flex;
  gap: 10px;
  align-items: center;

  span.divider {
    width: 1px;
    height: 10px;
    background: #ccc;
  }
`;

const ReviewContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-top: 0.5rem;
  white-space: pre-line; /* 줄바꿈 반영 */
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #999;
`;

const ReviewTitleContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-direction: row;
`;

const ReviewHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
`;

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reviews/${productId}`)
      .then(res => {
        setReviews(res.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const calculateAverage = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const score = rating;
    const fullStars = Math.floor(score);
    
    const hasHalfStar = (score - fullStars) >= 0.5; 
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '⯨'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  if (loading) return <div>후기 로딩 중...</div>;

  const average = calculateAverage();

  return (
    <SectionContainer>
      <SectionHeader>
        <AverageBox>
          <Average>
            {average}
          </Average>
          <BigStar>
            <span className="star">{renderStars(average)}</span>
            <ReviewCount>{reviews.length}건의 리뷰 분석 결과입니다.</ReviewCount>
          </BigStar>
        </AverageBox>
      </SectionHeader>

      <ReviewList>
        {reviews.length === 0 ? (
          <EmptyState>아직 등록된 후기가 없습니다.</EmptyState>
        ) : (
          reviews.map(review => (
            <ReviewItem key={review._id}>
              <ReviewHeaderContainer>
                <ReviewTitleContainer>
                  <StarRating>{renderStars(review.rating)}</StarRating>
                  <ReviewTitle>{review.title}</ReviewTitle>
                </ReviewTitleContainer>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </ReviewHeaderContainer>

              <MetaData>
                <span>{review.userId?.name || '익명'}</span> 
                <span className="divider"></span>
              </MetaData>
              
              <ReviewContent>{review.content}</ReviewContent>
            </ReviewItem>
          ))
        )}
      </ReviewList>
    </SectionContainer>
  );
}