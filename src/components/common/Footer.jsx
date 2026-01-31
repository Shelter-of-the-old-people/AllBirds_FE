// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #212121;
  color: white;
  padding: 80px 48px 40px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

/* 공통 그리드 스타일 */
const GridSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

/* --- 상단 섹션 --- */
const BigLinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  a {
    font-size: 26px;
    font-weight: 500;
    color: white;
    letter-spacing: -0.5px;
    &:hover { color: #ccc; text-decoration: underline; }
  }
`;

const SupportGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  a {
    font-size: 14px;
    color: white;
    &:hover { text-decoration: underline; }
  }
`;

/* --- 중간 섹션 (소셜 + 로고) --- */
const SocialGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;

  h5 {
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 5px;
  }

  p {
    font-size: 13px;
    line-height: 1.5;
    color: #e0e0e0;
  }

  .icons {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    
    a {
      display: block;
      width: 24px;
      height: 24px;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 0.7;
      }

      img {
        width: 100%;
        height: 100%;
        /* 검은 배경이므로 아이콘을 흰색으로 반전시킵니다. 
           (원본 색상을 원하시면 filter 속성을 지워주세요) */
        filter: invert(1); 
      }
    }
  }
`;

const LogoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  span {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  img {
    width: 80px;
  }
`;

/* --- 하단 섹션 --- */
const BottomSection = styled(GridSection)`
  margin-top: 20px;
  padding-top: 40px;
  
  font-size: 11px;
  color: white;
  line-height: 1.6;

  .copyright {
    a {
      text-decoration: underline;
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .biz-info {
    opacity: 0.8;
    text-align: left;
  }
`;

const Footer = () => {
  const bCorpLogoUrl = "https://sfycdn.speedsize.com/4aadaad8-50d5-458f-88dd-2f364bf4d82e/allbirds.co.kr/cdn/shop/files/image_2.png?v=1692870417&width=80";
  
  // 요청하신 아이콘 URL
  const instaIconUrl = "https://cdn-icons-png.flaticon.com/128/717/717392.png";
  const fbIconUrl = "https://cdn-icons-png.flaticon.com/128/3128/3128208.png";

  return (
    <FooterWrapper>
      <ContentContainer>
        
        {/* 상단: 큰 링크들 & 지원 메뉴 */}
        <GridSection>
          <BigLinkGroup>
            <a href="#">올멤버스 가입하기</a>
            <a href="#">오프라인 매장 찾기</a>
            <a href="#">카카오 채널 추가하기</a>
            <a href="#">올버즈 브랜드 스토리</a>
          </BigLinkGroup>

          <SupportGroup>
            <h4>올버즈 지원</h4>
            <a href="#">교환 및 반품</a>
            <a href="#">수선</a>
            <a href="#">문의하기</a>
            <a href="#">FAQ</a>
            <a href="#">채용</a>
          </SupportGroup>
        </GridSection>

        {/* 중간: 소셜 미디어 & B-Corp 로고 */}
        <GridSection>
          <SocialGroup>
            <h5>ALLBIRDS를 팔로우 하세요!</h5>
            <p>
              최신 정보나 Allbirds 상품의 스냅샷 등<br/>
              을 보실 수 있습니다. 오! 물론 귀여운 양<br/>
              도 보실 수 있죠. #weareallbirds #올버즈
            </p>
            <div className="icons">
              <a href="https://www.instagram.com/allbirdskorea" target="_blank" rel="noreferrer">
                <img src={instaIconUrl} alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/weareallbirds" target="_blank" rel="noreferrer">
                <img src={fbIconUrl} alt="Facebook" />
              </a>
            </div>
          </SocialGroup>

          <LogoGroup>
            <img src={bCorpLogoUrl} alt="B Corporation Logo" />
          </LogoGroup>
        </GridSection>

        {/* 하단: 사업자 정보 */}
        <BottomSection>
          <div className="copyright">
            © 2025 EFG.CO All Rights Reserved. 
            <br className="mobile-break" />
            <a href="#">이용 약관</a>, <a href="#">개인정보 처리방침</a>
          </div>
          <div className="biz-info">
            (주)이에프쥐 대표 박제우 | 서울특별시 강남구 강남대로 160길 45<br />
            통신판매업신고번호 2023-서울강남-04461 | 등록번호 146-81-03205<br />
            전화번호 070-4138-0128(수신자 부담) | E-mail help@efg.earth
          </div>
        </BottomSection>

      </ContentContainer>
    </FooterWrapper>
  );
};

export default Footer;