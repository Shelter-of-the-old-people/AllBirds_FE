// src/components/myPage/ReviewModal.jsx
import { useState, useEffect } from 'react'; // useEffect 추가
import styled from 'styled-components';
import { api } from '../../api/axios';

// ... (스타일 코드는 기존과 동일, 생략) ...
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
  resize: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &.cancel {
    background: #eee;
    color: #333;
    border: none;
  }
  
  &.submit {
    background: #212a2f;
    color: white;
    border: none;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export default function ReviewModal({ isOpen, onClose, product, review, onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (review) {
        setRating(review.rating);
        setTitle(review.title || '');
        setContent(review.content);
      } else {
        setRating(5);
        setTitle('');
        setContent('');
      }
    }
  }, [isOpen, review]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (review) {
        await api.put(`/reviews/${review._id}`, {
          rating: Number(rating),
          title,
          content
        });
        alert('후기가 수정되었습니다.');
      } else {
        await api.post('/reviews', {
          productId: product.productId, 
          rating: Number(rating),
          title,
          content
        });
        alert('후기가 등록되었습니다.');
      }
      
      onClose();
      onSubmitSuccess();
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <Title>{review ? '후기 수정' : '후기 작성'} - {product.name}</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label>별점</Label>
            <br />
            <Select value={rating} onChange={e => setRating(e.target.value)}>
              <option value="5">★★★★★ (5점)</option>
              <option value="4">★★★★☆ (4점)</option>
              <option value="3">★★★☆☆ (3점)</option>
              <option value="2">★★☆☆☆ (2점)</option>
              <option value="1">★☆☆☆☆ (1점)</option>
            </Select>
          </div>

          <div>
            <Label>제목</Label>
            <Input 
              type="text" 
              placeholder="제목을 입력해주세요." 
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label>내용</Label>
            <Textarea 
              placeholder="상품에 대한 솔직한 후기를 남겨주세요."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>취소</Button>
            <Button type="submit" className="submit">{review ? '수정하기' : '등록하기'}</Button>
          </ButtonGroup>
        </Form>
      </ModalBox>
    </Overlay>
  );
}