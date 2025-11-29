import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../api/axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 60vh;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #212a2f;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #212a2f;
  }
`;

const LoginButton = styled.button`
  padding: 1rem;
  background-color: #212a2f;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const TestButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const TestButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  color: #555;
  transition: all 0.2s;

  &:hover {
    background-color: #e0e0e0;
    color: #212a2f;
    border-color: #bbb;
  }
`;

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const performLogin = async (id, pw) => {
    try {
      const res = await api.post('/auth/login', { userId: id, password: pw });
      
      if (res.status === 200) {
        const user = res.data.user;
        alert(`${user.name}님 환영합니다!`);
        
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      alert("로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(userId, password);
  };

  return (
    <Container>
      <Title>로그인</Title>
      
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="아이디" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Input 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton type="submit">로그인</LoginButton>
      </Form>

      <TestButtonGroup>
        <TestButton type="button" onClick={() => performLogin('customer1', '1234')}>
          일반 고객 접속<br/>(customer1)
        </TestButton>
        <TestButton type="button" onClick={() => performLogin('admin', '1234')}>
          관리자 접속<br/>(admin)
        </TestButton>
      </TestButtonGroup>

    </Container>
  );
}