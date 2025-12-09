import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ProductDetailManage from './ProductDetailManage';

// --- 옵션 데이터 정의 ---
const CATEGORY_OPTIONS = [
  { label: '라이프스타일', value: 'lifestyle' },
  { label: '슬립온', value: 'slip-on' }
];

const MATERIAL_OPTIONS = [
  '가볍고 시원한 tree',
  '면',
  '부드럽고 따뜻한 wool',
  '캔버스',
  '플라스틱 제로 식물성 가죽'
];

// --- 스타일 정의 ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: span 2;
  }

  label {
    font-weight: bold;
    font-size: 0.9rem;
    color: #212a2f;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 0.8rem 0;

  label {
    font-weight: normal;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #212a2f;
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  grid-column: span 2;
  background-color: #212a2f;
  color: white;
  padding: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  &:hover { background-color: #000; }
`;

const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default function ProductManage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null); 

  const [formData, setFormData] = useState({
    name: '', price: '', discountRate: 0,
    categories: [],
    materials: '',
    availableSizes: '',
    description: ''
  });
  const [images, setImages] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value, isChecked) => {
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== value)
      }));
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      return alert('카테고리를 최소 1개 이상 선택해주세요.');
    }
    if (formData.materials === '') {
      return alert('소재를 선택해주세요.');
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('discountRate', formData.discountRate);
    data.append('availableSizes', formData.availableSizes);
    data.append('categories', formData.categories.join(',')); 
    data.append('materials', formData.materials);
    data.append('description', formData.description); 

    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      });
      alert('상품이 등록되었습니다!');
      fetchProducts();
    
      setFormData({
        name: '', price: '', discountRate: 0,
        categories: [],
        materials: '',
        availableSizes: '',
        description: '' // 초기화
      });
      setImages(null);
    } catch (err) {
      alert('상품 등록 실패 (관리자 로그인이 필요할 수 있습니다)');
      console.error(err);
    }
  };

  if (selectedProductId) {
    return (
      <ProductDetailManage 
        productId={selectedProductId} 
        onBack={() => {
          setSelectedProductId(null);
          fetchProducts();
        }} 
      />
    );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h3>신규 상품 등록</h3>
        
        <InputGroup className="full-width">
          <label>상품명</label>
          <Input name="name" value={formData.name} placeholder="예: 남성 울 러너" onChange={handleChange} required />
        </InputGroup>
        
        <InputGroup>
          <label>가격 (원)</label>
          <Input type="number" name="price" value={formData.price} placeholder="150000" onChange={handleChange} required />
        </InputGroup>
        
        <InputGroup>
          <label>할인율 (%)</label>
          <Input type="number" name="discountRate" value={formData.discountRate} placeholder="0" onChange={handleChange} />
        </InputGroup>

        <InputGroup>
          <label>카테고리 (중복 선택 가능)</label>
          <CheckboxGroup>
            {CATEGORY_OPTIONS.map((option) => (
              <label key={option.value}>
                <input 
                  type="checkbox"
                  checked={formData.categories.includes(option.value)}
                  onChange={(e) => handleCategoryChange(option.value, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
          </CheckboxGroup>
        </InputGroup>

        <InputGroup>
          <label>소재</label>
          <Select 
            name="materials" 
            value={formData.materials} 
            onChange={handleChange}
            required
          >
            <option value="">-- 소재 선택 --</option>
            {MATERIAL_OPTIONS.map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup className="full-width">
          <label>가능 사이즈 (쉼표 구분)</label>
          <Input name="availableSizes" value={formData.availableSizes} placeholder="250,260,270,280" onChange={handleChange} required />
        </InputGroup>

        <InputGroup className="full-width">
          <label>상품 설명</label>
          <Input 
            name="description" 
            value={formData.description} 
            placeholder="상품에 대한 간단한 설명을 입력하세요." 
            onChange={handleChange} 
          />
        </InputGroup>

        <InputGroup className="full-width">
          <label>이미지 (다중 선택 가능)</label>
          <Input type="file" multiple onChange={handleFileChange} required />
        </InputGroup>
        
        <SubmitButton type="submit">등록하기</SubmitButton>
      </Form>

      {/* 등록된 상품 리스트 */}
      <div style={{background: 'white', padding: '2rem', borderRadius: '8px'}}>
        <h3>등록된 상품 목록 ({products.length}개)</h3>
        <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
          * 상품을 클릭하면 수정 및 매출 확인 페이지로 이동합니다.
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map(p => {
            const discountedPrice = p.price * (1 - p.discountRate / 100);
            return (
              <ListItem key={p._id} onClick={() => setSelectedProductId(p._id)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{p.name}</strong>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>
                    {p.categories.join(', ')} / {p.materials.join(', ')}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {p.discountRate > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.85rem', color: '#999', textDecoration: 'line-through' }}>
                        {p.price.toLocaleString()}원
                      </span>
                      <div style={{ fontWeight: 'bold', color: '#212a2f' }}>
                        <span style={{ color: '#ff3b30', marginRight: '6px' }}>{p.discountRate}%</span>
                        {discountedPrice.toLocaleString()}원
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontWeight: '500' }}>
                      {p.price.toLocaleString()}원
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.8rem', marginTop: '4px', color: p.availableSizes.length ? 'green' : '#ff3b30' }}>
                    {p.availableSizes.length > 0 
                      ? `재고: ${p.availableSizes.join(', ')}` 
                      : '품절'
                    }
                  </div>
                </div>
              </ListItem>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}