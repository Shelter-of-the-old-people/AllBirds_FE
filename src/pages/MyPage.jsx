import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import ReviewModal from '../components/myPage/ReviewModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  gap: 2rem;
  min-height: 80vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MenuItem = styled.div`
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem 0;

  &.active {
    color: #212a2f;
    font-weight: 700;
    text-decoration: underline;
  }
  
  &:hover {
    color: #212a2f;
  }
`;

const ReviewTitleText = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  margin: 5px 0;
  color: #333;
`;

const Content = styled.div`
  flex: 1;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #212a2f;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderItemCard = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ItemMainInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
`;

const InfoArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.95rem;
  color: #333;
  
  strong {
    font-weight: 600;
    margin-right: 0.5rem;
  }
`;

const ProductNameLink = styled(Link)`
  color: #333;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: #212a2f;
    font-weight: 700;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-self: center;
`;

const ReviewButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #212a2f;
  color: #212a2f;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #212a2f;
    color: white;
  }
`;

const MyReviewBox = styled.div`
  background-color: #f9f9f9;
  margin: 5px;
  padding: 10px;
  padding-right: 35px; 
  border-radius: 4px;
  font-size: 0.9rem;
  position: relative; 
  .rating { color: #ffae00ff; font-weight: bold; margin-bottom: 5px; }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: rgba(0, 0, 0, 1);
  }
`;

const EmptyMsg = styled.div`
  text-align: center;
  color: #999;
  padding: 3rem 0;
`;

const ReviewContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-direction: row;
`;

export default function MyPage() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [targetReview, setTargetReview] = useState(null); 

  const fetchData = async () => {
    try {
      const [orderRes, reviewRes] = await Promise.all([
        api.get('/orders'),
        api.get('/reviews/my')
      ]);
      setOrders(orderRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchData();
    } else {
        setLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
        await logout();
        clearCart();
        alert("로그아웃 되었습니다.");
        navigate('/');
    } catch (err) {
        console.error("로그아웃 중 오류:", err);
    }
  };

  const openReviewModal = (orderItem, existingReview = null) => {
    setSelectedProduct(orderItem);
    setTargetReview(existingReview); 
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if(!confirm("정말 후기를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      alert("후기가 삭제되었습니다.");
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const handleImageClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <Sidebar>
        <MenuItem>회원 정보</MenuItem>
        <MenuItem className="active">지난 주문 내역</MenuItem>
        <MenuItem>주문 정보 등록</MenuItem>
        <MenuItem>올멤버스 혜택</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Sidebar>

      <Content>
        <PageTitle>지난 주문 내역</PageTitle>

        <OrderList>
          {orders.length === 0 ? (
            <EmptyMsg>주문 내역이 없습니다.</EmptyMsg>
          ) : (
            orders.map((order) => (
              order.items.map((item, idx) => {
                const myReview = reviews.find(r => r.productId === item.productId);

                return (
                  <OrderItemCard key={`${order._id}-${idx}`}>
                    <ItemMainInfo>
                        <ProductImage 
                            src={item.image} 
                            alt="상품" 
                            onClick={() => handleImageClick(item.productId)}
                        />
                        <InfoArea>
                            <Row>
                            <span>
                                <strong>제품명:</strong> 
                                <ProductNameLink to={`/products/${item.productId}`}>
                                {item.name}
                                </ProductNameLink>
                            </span>
                            <span><strong>수량:</strong> {item.quantity}개</span>
                            </Row>
                            <Row>
                            <span><strong>결제금액:</strong> ₩{(item.price * item.quantity).toLocaleString()}</span>
                            <span><strong>결제일:</strong> {new Date(order.orderedAt).toISOString().split('T')[0]}</span>
                            </Row>
                        </InfoArea>

                        <ActionButtons>
                            {myReview ? (
                            <ReviewButton onClick={() => openReviewModal(item, myReview)}>
                                후기수정
                            </ReviewButton>
                            ) : (
                            <ReviewButton onClick={() => openReviewModal(item, null)}>
                                후기작성
                            </ReviewButton>
                            )}
                        </ActionButtons>
                        </ItemMainInfo>

                        {myReview && (
                        <MyReviewBox>
                            <CloseButton 
                                onClick={() => handleDeleteReview(myReview._id)}
                                title="후기 삭제"
                            >
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            </CloseButton>
                            <ReviewContainer>
                                <ReviewTitleText>{myReview.title}</ReviewTitleText>
                                <div>{new Date(myReview.createdAt).toLocaleDateString()}</div>
                            </ReviewContainer>
                            <div className="rating">{'★'.repeat(myReview.rating)}</div>
                            <div>{myReview.content}</div>
                        </MyReviewBox>
                        )}
                    </OrderItemCard>
                );
              })
            ))
          )}
        </OrderList>
      </Content>

      <ReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        review={targetReview} 
        onSubmitSuccess={fetchData} 
      />
    </Container>
  );
}