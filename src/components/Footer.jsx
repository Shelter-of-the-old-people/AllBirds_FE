import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #212a2f;
  color: white;
  padding: 2rem;
  text-align: center;
  margin-top: auto;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <p>&copy; 2025 Allbirds Clone Project. All rights reserved.</p>
    </FooterWrapper>
  );
}