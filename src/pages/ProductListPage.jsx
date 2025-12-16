import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ListProductCard from '../components/ProductListPage/ListProductCard';

/* --- 스타일 정의 --- */
const PageContainer = styled.div` max-width: 1400px; margin: 0 auto; padding: 40px 48px; font-family: 'Noto Sans KR', sans-serif; `;
const HeaderSection = styled.div` margin-bottom: 40px; h2 { font-size: 32px; font-weight: bold; margin-bottom: 10px; } p { font-size: 14px; color: #555; margin-bottom: 30px; } `;
const TopFilterBar = styled.div` display: flex; align-items: center; gap: 24px; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; height: 60px; `;

// [수정 1] margin-left: auto 추가 -> 이 요소 앞의 여백을 모두 차지하여 우측 끝으로 밀어냄
const ResetWrapper = styled.div` 
  display: flex; align-items: center; justify-content: flex-end; 
  height: 40px; min-width: 100px; padding: 0 10px; 
  background-color: white; border: 1px solid #e0e0e0; border-radius: 2px; 
  margin-left: auto; /* 핵심: 우측 정렬 */
  transition: border-color 0.2s; 
  &:hover { border-color: #212121; } 
`;

const ResetButton = styled.button` width: auto; height: 100%; background: transparent; border: 1px solid black; padding: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; color: #212121; cursor: pointer; `;
const CategoryTab = styled.button` background: transparent; border: none; padding: 0; height: 100%; cursor: pointer; font-size: 15px; font-weight: ${props => (props.$active ? '700' : '400')}; color: ${props => (props.$active ? '#212121' : '#757575')}; display: flex; align-items: center; &:hover { color: #212121; } `;
const TabText = styled.span` position: relative; padding-bottom: 4px; &::after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background-color: #212121; transform: scaleX(${props => (props.$active ? 1 : 0)}); transform-origin: center; transition: transform 0.2s ease-in-out; } `;
const ContentLayout = styled.div` display: flex; gap: 40px; `;
const Sidebar = styled.aside` width: 250px; flex-shrink: 0; `;
const ActiveFiltersSection = styled.div` margin-bottom: 40px; h4 { font-size: 18px; font-weight: 500; margin-bottom: 15px; } `;
const FilterTagsWrapper = styled.div` display: flex; flex-wrap: wrap; gap: 10px; `;
const FilterTag = styled.button` background: white; border: 1px solid #212121; padding: 8px 12px; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; border-radius: 2px; &:hover { background: #f9f9f9; } `;
const FilterResetLink = styled.div` margin-top: 15px; font-size: 14px; text-decoration: underline; cursor: pointer; color: #212121; `;
const FilterSection = styled.div` margin-bottom: 40px; h4 { font-size: 18px; font-weight: 500; margin-bottom: 15px; } `;
const SizeGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; `;
const SizeBtn = styled.button` padding: 10px 0; border: 1px solid #212121; font-size: 14px; border-radius: 2px; cursor: pointer; transition: all 0.2s; background: ${props => props.$active ? '#212121' : 'white'}; color: ${props => props.$active ? 'white' : '#212121'}; font-weight: ${props => props.$active ? '600' : '400'}; &:hover { background: #212121; color: white; } `;
const MaterialList = styled.div` display: flex; flex-direction: column; gap: 12px; `;
const CheckLabel = styled.label` display: flex; align-items: center; gap: 10px; font-size: 15px; cursor: pointer; input { width: 20px; height: 20px; accent-color: #212121; border: 1px solid #212121; } `;
const ProductGrid = styled.div` flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; align-content: start; `;

const ProductListPage = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // 필터 상태
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // [수정 2] 카테고리 매핑 테이블 (한글 탭 -> 영어 DB 값)
  const categoryMap = {
    '라이프스타일': 'lifestyle',
    '슬립온': 'slip-on',
    '액티브': 'active',
    // 필요한 경우 추가 매핑
  };

  // --- 백엔드 API 호출 ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        
        if (activeCategory) {
          if (activeCategory === '신제품') params.isNew = 'true';
          else if (activeCategory === '세일') params.onSale = 'true';
          else {
            // [수정 3] 한글 카테고리를 영어 값으로 변환하여 전송
            // 매핑된 값이 있으면 그 값을, 없으면 원래 값을 보냄 (DB가 한글일 수도 있으므로)
            params.categories = categoryMap[activeCategory] || activeCategory;
          }
        }

        if (selectedSizes.length > 0) {
          params.sizes = selectedSizes.join(',');
        }

        if (selectedMaterials.length > 0) {
          params.materials = selectedMaterials.join(',');
        }

        // console.log("요청 파라미터 확인:", params); // 디버깅용

        const response = await axios.get('/api/products', { params });
        
        const formattedData = response.data.map(item => {
          const allSizes = [220, 230, 240, 250, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310];
          const stockObj = {};
          
          allSizes.forEach(s => {
            stockObj[s] = item.availableSizes && item.availableSizes.includes(s);
          });

          return {
            id: item._id, 
            name: item.name,
            description: item.description,
            category: item.categories && item.categories[0], 
            price: Math.round(item.price * (1 - (item.discountRate || 0) / 100)), 
            originalPrice: item.price,
            discountRate: item.discountRate || 0,
            material: item.materials && item.materials[0],
            images: item.images || [], 
            stock: stockObj, 
            isSale: (item.discountRate || 0) > 0,
          };
        });

        setProducts(formattedData);
      } catch (error) {
        console.error("상품 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, selectedSizes, selectedMaterials]);

  // --- 핸들러 ---
  const handleCategoryClick = (cat) => activeCategory === cat ? setActiveCategory(null) : setActiveCategory(cat);
  const handleResetCategory = () => setActiveCategory(null);
  
  const toggleSize = (size) => {
    selectedSizes.includes(size) 
      ? setSelectedSizes(selectedSizes.filter(s => s !== size)) 
      : setSelectedSizes([...selectedSizes, size]);
  };

  const toggleMaterial = (mat) => {
    selectedMaterials.includes(mat) 
      ? setSelectedMaterials(selectedMaterials.filter(m => m !== mat)) 
      : setSelectedMaterials([...selectedMaterials, mat]);
  };

  const resetSidebarFilters = () => {
    setSelectedSizes([]);
    setSelectedMaterials([]);
  };

  return (
    <PageContainer>
      <HeaderSection>
        <h2>남성 신발</h2>
        <p>자연 소재로 만든 편안한 신발을 만나보세요.</p>
        
        <TopFilterBar>
          {/* [수정 4] 카테고리 탭을 먼저 렌더링 */}
          {['신제품', '라이프스타일', '액티브', '세일', '슬립온', '슬리퍼'].map(cat => (
            <CategoryTab 
              key={cat} 
              $active={activeCategory === cat} 
              onClick={() => handleCategoryClick(cat)}
            >
              <TabText $active={activeCategory === cat}>{cat}</TabText>
            </CategoryTab>
          ))}

          {/* [수정 5] ResetWrapper를 맨 뒤로 이동 (margin-left: auto가 작동하도록) */}
          <ResetWrapper>
            <ResetButton onClick={handleResetCategory}>신발 ✕</ResetButton>
          </ResetWrapper>
        </TopFilterBar>
      </HeaderSection>

      <ContentLayout>
        <Sidebar>
          {(selectedSizes.length > 0 || selectedMaterials.length > 0) && (
            <ActiveFiltersSection>
              <h4>적용된 필터</h4>
              <FilterTagsWrapper>
                {selectedSizes.map(s => <FilterTag key={s} onClick={() => toggleSize(s)}>{s} ✕</FilterTag>)}
                {selectedMaterials.map(m => <FilterTag key={m} onClick={() => toggleMaterial(m)}>{m} ✕</FilterTag>)}
              </FilterTagsWrapper>
              <FilterResetLink onClick={resetSidebarFilters}>초기화</FilterResetLink>
            </ActiveFiltersSection>
          )}

          <FilterSection>
            <h4>사이즈</h4>
            <SizeGrid>
              {[220, 230, 240, 250, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310].map(size => (
                <SizeBtn 
                  key={size} 
                  $active={selectedSizes.includes(size)}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </SizeBtn>
              ))}
            </SizeGrid>
          </FilterSection>

          <FilterSection>
            <h4>소재</h4>
            <MaterialList>
              {[
                { label: '가볍고 시원한 tree', value: '가볍고 시원한 tree' },
                { label: '부드럽고 따뜻한 wool', value: '부드럽고 따뜻한 wool' },
                { label: '캔버스', value: '캔버스' },
                { label: '플라스틱 제로 식물성 가죽', value: '플라스틱 제로 식물성 가죽' },
              ].map((mat) => (
                <CheckLabel key={mat.value}>
                  <input 
                    type="checkbox" 
                    checked={selectedMaterials.includes(mat.value)}
                    onChange={() => toggleMaterial(mat.value)}
                  />
                  {mat.label}
                </CheckLabel>
              ))}
            </MaterialList>
          </FilterSection>
        </Sidebar>

        <ProductGrid>
          {loading ? (
             <p style={{gridColumn:'1/-1', textAlign:'center', padding:'50px'}}>로딩 중...</p>
          ) : (
            <>
              {products.map(product => (
                <ListProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <p style={{gridColumn:'1/-1', textAlign:'center', padding:'50px'}}>조건에 맞는 상품이 없습니다.</p>
              )}
            </>
          )}
        </ProductGrid>
      </ContentLayout>
    </PageContainer>
  );
};

export default ProductListPage;