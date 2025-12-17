import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ListProductCard from '../components/ProductListPage/ListProductCard';

/* --- 스타일 정의 --- */
const PageContainer = styled.div` max-width: 1400px; margin: 0 auto; padding: 40px 48px; font-family: 'Noto Sans KR', sans-serif; `;
const HeaderSection = styled.div` margin-bottom: 40px; h2 { font-size: 32px; font-weight: bold; margin-bottom: 10px; } p { font-size: 14px; color: #555; margin-bottom: 30px; } `;
const TopFilterBar = styled.div` display: flex; align-items: center; gap: 24px; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; height: 60px; `;

const ResetWrapper = styled.div` 
  display: flex; align-items: center; justify-content: flex-end; 
  height: 50px; min-width: 100px; padding: 0 10px; 
  background-color: white; border: 1px solid #e0e0e0; border-radius: 2px; 
  transition: border-color 0.2s; 
  &:hover { border-color: #212121; } 
`;

const ResetButton = styled.button` width: 70px; height: 100%; background: transparent; border: 1px solid black; padding: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; color: #212121; cursor: pointer; `;
const CategoryTab = styled.button` background: transparent; border: none; padding: 0; height: 100%; cursor: pointer; font-size: 15px; font-weight: ${props => (props.$active ? '700' : '400')}; color: ${props => (props.$active ? '#212121' : '#757575')}; display: flex; align-items: center; &:hover { color: #212121; } `;
const TabText = styled.span` position: relative; padding-bottom: 4px; &::after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background-color: #212121; transform: scaleX(${props => (props.$active ? 1 : 0)}); transform-origin: center; transition: transform 0.2s ease-in-out; } `;

/* 레이아웃 */
const ContentLayout = styled.div` display: flex; gap: 40px; `;
const Sidebar = styled.aside` width: 250px; flex-shrink: 0; `;
const RightContent = styled.div` flex: 1; display: flex; flex-direction: column; gap: 20px; `;

/* 결과 바 (카운트 + 정렬) */
const ResultBar = styled.div` display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; `;
const CountText = styled.span` font-size: 14px; color: #555; font-weight: 500; `;
const SortWrapper = styled.div` position: relative; display: flex; justify-content: flex-end; `;

const IconButton = styled.button` background: transparent; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; `;

const SortDropdown = styled.div`
  position: absolute;
  top: 50px; 
  right: 0;
  width: 160px;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-radius: 4px;
`;

const SortOptionItem = styled.button`
  background: white;
  border: none;
  text-align: left;
  padding: 10px 16px;
  font-size: 14px;
  color: ${props => props.$selected ? '#212121' : '#757575'};
  font-weight: ${props => props.$selected ? '700' : '400'};
  cursor: pointer;
  
  &:hover { background-color: #f5f5f5; color: #212121; }
`;

/* 필터 및 그리드 스타일 */
const ActiveFiltersSection = styled.div` margin-bottom: 40px; h4 { font-size: 18px; font-weight: 500; margin-bottom: 15px; } `;
const FilterTagsWrapper = styled.div` display: flex; flex-wrap: wrap; gap: 10px; `;
const FilterTag = styled.button` background: white; border: 1px solid #212121; padding: 8px 12px; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; border-radius: 2px; &:hover { background: #f9f9f9; } `;
const FilterResetLink = styled.div` margin-top: 15px; font-size: 14px; text-decoration: underline; cursor: pointer; color: #212121; `;
const FilterSection = styled.div` margin-bottom: 40px; h4 { font-size: 18px; font-weight: 500; margin-bottom: 15px; } `;
const SizeGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; `;
const SizeBtn = styled.button` padding: 10px 0; border: 1px solid #212121; font-size: 14px; border-radius: 2px; cursor: pointer; transition: all 0.2s; background: ${props => props.$active ? '#212121' : 'white'}; color: ${props => props.$active ? 'white' : '#212121'}; font-weight: ${props => props.$active ? '600' : '400'}; &:hover { background: #212121; color: white; } `;
const MaterialList = styled.div` display: flex; flex-direction: column; gap: 12px; `;
const CheckLabel = styled.label` display: flex; align-items: center; gap: 10px; font-size: 15px; cursor: pointer; input { width: 20px; height: 20px; accent-color: #212121; border: 1px solid #212121; } `;
const ProductGrid = styled.div` width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; align-content: start; `;

/* 아이콘 컴포넌트 */
const IconSortOpen = () => (
  <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.689941" width="43" height="43" rx="2.5" fill="white" stroke="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.4584 22.1899C28.4584 22.5351 28.1785 22.8149 27.8334 22.8149H16.1667C15.8215 22.8149 15.5417 22.5351 15.5417 22.1899C15.5417 21.8448 15.8215 21.5649 16.1667 21.5649H27.8334C28.1785 21.5649 28.4584 21.8448 28.4584 22.1899Z" fill="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M30.9584 18.0233C30.9584 18.3685 30.6785 18.6483 30.3334 18.6483H13.6667C13.3215 18.6483 13.0417 18.3685 13.0417 18.0233C13.0417 17.6781 13.3215 17.3983 13.6667 17.3983H30.3334C30.6785 17.3983 30.9584 17.6781 30.9584 18.0233ZM25.9584 26.3566C25.9584 26.7018 25.6785 26.9816 25.3334 26.9816H18.6667C18.3215 26.9816 18.0417 26.7018 18.0417 26.3566C18.0417 26.0115 18.3215 25.7316 18.6667 25.7316H25.3334C25.6785 25.7316 25.9584 26.0115 25.9584 26.3566Z" fill="black"/>
  </svg>
);

const IconSortClose = () => (
  <svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.689941" width="43" height="43" rx="2.5" fill="black" stroke="black"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.4584 22.1899C28.4584 22.5351 28.1786 22.8149 27.8334 22.8149H16.1667C15.8216 22.8149 15.5417 22.5351 15.5417 22.1899C15.5417 21.8448 15.8216 21.5649 16.1667 21.5649H27.8334C28.1786 21.5649 28.4584 21.8448 28.4584 22.1899Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M30.9584 18.0233C30.9584 18.3685 30.6786 18.6483 30.3334 18.6483H13.6667C13.3216 18.6483 13.0417 18.3685 13.0417 18.0233C13.0417 17.6781 13.3216 17.3983 13.6667 17.3983H30.3334C30.6786 17.3983 30.9584 17.6781 30.9584 18.0233ZM25.9584 26.3566C25.9584 26.7018 25.6786 26.9816 25.3334 26.9816H18.6667C18.3216 26.9816 18.0417 26.7018 18.0417 26.3566C18.0417 26.0115 18.3216 25.7316 18.6667 25.7316H25.3334C25.6786 25.7316 25.9584 26.0115 25.9584 26.3566Z" fill="white"/>
  </svg>
);

const ProductListPage = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // 필터 상태
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // [수정] 정렬 상태 (기본: 추천순)
  const [sortOption, setSortOption] = useState('recommend'); 
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const categoryMap = {
    '라이프스타일': 'lifestyle',
    '슬립온': 'slip-on',
    '액티브': 'active',
  };

  // 정렬 옵션 정의
  const sortOptions = [
    { value: 'recommend', label: '추천순' },
    { value: 'sales', label: '판매순' },
    { value: 'lowPrice', label: '가격 낮은순' },
    { value: 'highPrice', label: '가격 높은순' },
    { value: 'newest', label: '최신 등록순' }
  ];

  // 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- API 호출 ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory) {
          if (activeCategory === '신제품') params.isNew = 'true';
          else if (activeCategory === '세일') params.onSale = 'true';
          else params.categories = categoryMap[activeCategory] || activeCategory;
        }
        if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');
        if (selectedMaterials.length > 0) params.materials = selectedMaterials.join(',');

        const response = await axios.get('/api/products', { params });
        
        const formattedData = response.data.map(item => {
          const allSizes = [220, 230, 240, 250, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310];
          const stockObj = {};
          
          allSizes.forEach(s => {
            stockObj[s] = item.availableSizes && item.availableSizes.includes(s);
          });

          return {
            id: item._id || item.id, // db.json 호환
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
            ranking: item.ranking || 999, // 판매순 정렬용 (없으면 하위로)
            createdAt: item.createdAt || 0, // 최신순 정렬용
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

  // [수정] 프론트엔드 정렬 로직 (5가지 옵션)
  const sortedProducts = useMemo(() => {
    let items = [...products];

    switch (sortOption) {
      case 'lowPrice':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'highPrice':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        // 랭킹 오름차순 (1등이 먼저)
        items.sort((a, b) => a.ranking - b.ranking);
        break;
      case 'newest':
        // 최신순 (ID가 클수록 최신이라고 가정하거나 createdAt 사용)
        items.sort((a, b) => b.id - a.id);
        break;
      case 'recommend':
      default:
        // API 기본 순서 유지
        break;
    }
    return items;
  }, [products, sortOption]);

  const handleCategoryClick = (cat) => activeCategory === cat ? setActiveCategory(null) : setActiveCategory(cat);
  const handleResetCategory = () => setActiveCategory(null);
  const toggleSize = (size) => {
    selectedSizes.includes(size) ? setSelectedSizes(selectedSizes.filter(s => s !== size)) : setSelectedSizes([...selectedSizes, size]);
  };
  const toggleMaterial = (mat) => {
    selectedMaterials.includes(mat) ? setSelectedMaterials(selectedMaterials.filter(m => m !== mat)) : setSelectedMaterials([...selectedMaterials, mat]);
  };
  const resetSidebarFilters = () => { setSelectedSizes([]); setSelectedMaterials([]); };
  const handleSortChange = (option) => { setSortOption(option); setIsSortOpen(false); };

  return (
    <PageContainer>
      <HeaderSection>
        <h2>남성 신발</h2>
        <p>자연 소재로 만든 편안한 신발을 만나보세요.</p>
        <TopFilterBar>
          <ResetWrapper><ResetButton onClick={handleResetCategory}>신발 ✕</ResetButton></ResetWrapper>
          {['신제품', '라이프스타일', '액티브', '세일', '슬립온', '슬리퍼'].map(cat => (
            <CategoryTab key={cat} $active={activeCategory === cat} onClick={() => handleCategoryClick(cat)}>
              <TabText $active={activeCategory === cat}>{cat}</TabText>
            </CategoryTab>
          ))}
        </TopFilterBar>
      </HeaderSection>

      <ContentLayout>
        {/* 좌측 필터 */}
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
                <SizeBtn key={size} $active={selectedSizes.includes(size)} onClick={() => toggleSize(size)}>{size}</SizeBtn>
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
                  <input type="checkbox" checked={selectedMaterials.includes(mat.value)} onChange={() => toggleMaterial(mat.value)} />
                  {mat.label}
                </CheckLabel>
              ))}
            </MaterialList>
          </FilterSection>
        </Sidebar>

        {/* 우측 컨텐츠 */}
        <RightContent>
          <ResultBar>
            <CountText>{sortedProducts.length}개 제품</CountText>
            <SortWrapper ref={sortRef}>
              <IconButton onClick={() => setIsSortOpen(!isSortOpen)}>
                {isSortOpen ? <IconSortClose /> : <IconSortOpen />}
              </IconButton>
              
              {isSortOpen && (
                <SortDropdown>
                  {sortOptions.map((opt) => (
                    <SortOptionItem 
                      key={opt.value}
                      $selected={sortOption === opt.value} 
                      onClick={() => handleSortChange(opt.value)}
                    >
                      {opt.label}
                    </SortOptionItem>
                  ))}
                </SortDropdown>
              )}
            </SortWrapper>
          </ResultBar>

          <ProductGrid>
            {loading ? (
               <p style={{gridColumn:'1/-1', textAlign:'center', padding:'50px'}}>로딩 중...</p>
            ) : (
              <>
                {sortedProducts.map(product => (
                  <ListProductCard key={product.id} product={product} />
                ))}
                {sortedProducts.length === 0 && (
                  <p style={{gridColumn:'1/-1', textAlign:'center', padding:'50px'}}>조건에 맞는 상품이 없습니다.</p>
                )}
              </>
            )}
          </ProductGrid>
        </RightContent>
      </ContentLayout>
    </PageContainer>
  );
};

export default ProductListPage;