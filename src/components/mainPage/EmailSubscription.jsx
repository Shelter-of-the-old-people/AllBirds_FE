import styled from 'styled-components';

// --- Styled Components ---

const Section = styled.section`
  padding: 6rem 2rem;
  
  background-color: #f5f5f5;
  text-align: center;
  border-bottom: 1px solid black;
  
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 350;
  color: #212a2f;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #212a2f;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  width: 90%;
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;

  /* 모바일에서는 세로 배치, 태블릿 이상에선 가로 배치 */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1; /* 남은 공간 차지 */
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: white;
  color: #212a2f;

  &:focus {
    border-color: #212a2f;
    box-shadow: 0 0 0 1px #212a2f;
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  background-color: #212a2f;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 1rem 2rem;
  border: 1px solid #212a2f;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  color: #999;
  line-height: 1.4;
  
  a {
    color: #666;
    text-decoration: underline;
    font-weight: 600;
  }
`;

// --- Component ---

export default function EmailSubscription() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("구독해주셔서 감사합니다!");
  };

  return (
    <Section>
      <ContentWrapper>
        <Title>올버즈 뉴스레터 구독</Title>
        <Description>
          최신 신제품 소식과 혜택을 가장 먼저 받아보세요.
        </Description>

        <Form onSubmit={handleSubmit}>
          <EmailInput 
            type="email" 
            placeholder="E-mail" 
            required 
          />
          <SubmitButton type="submit">구독</SubmitButton>
        </Form>

        <Disclaimer>
          구독 시 마케팅 이메일 수신에 동의하게 됩니다. 자세한 내용은
          <a href="#"> 개인정보처리방침</a> 및 <a href="#"> 이용약관</a>을 확인해 주세요.
        </Disclaimer>
      </ContentWrapper>
    </Section>
  );
}