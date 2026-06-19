import React, { useState, useEffect, useRef } from 'react';

export default function MenuTab() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [currentItem, setCurrentItem] = useState({
    id: null, name: '', description: '', originalPrice: '', discountPrice: '',
    stockQuantity: '', expiryDate: '', categoryId: '', image: null
  });

  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch('https://neama1.runasp.net/Api/BranchDashboard/categories', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error("Error fetching categories", err); }
  };

  const fetchItems = async (search = '') => {
    setLoadingItems(true);
    try {
      const token = localStorage.getItem("userToken");
      const query = search ? `?searchname=${search}` : '';
      const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/items${query}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setItems(await res.json());
    } catch (err) { console.error("Error fetching items", err); }
    finally { setLoadingItems(false); }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(searchQuery);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) return;

    const token = localStorage.getItem("userToken");
    try {
      if (currentCategory.id) {
        await fetch(`https://neama1.runasp.net/Api/BranchDashboard/categories`, {
          method: 'PUT',
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentCategory.id, name: currentCategory.name })
        });
      } else {
        await fetch(`https://neama1.runasp.net/Api/BranchDashboard/categories?Name=${currentCategory.name}`, {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
      await fetch(`https://neama1.runasp.net/Api/BranchDashboard/categories/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
      });
      fetchCategories();
      fetchItems(searchQuery); 
    } catch (err) { console.error(err); }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const formData = new FormData();
    
    formData.append('Name', currentItem.name);
    formData.append('Description', currentItem.description);
    formData.append('OriginalPrice', currentItem.originalPrice);
    formData.append('DiscountPrice', currentItem.discountPrice);
    formData.append('StockQuantity', currentItem.stockQuantity);
    formData.append('CategoryId', currentItem.categoryId);
    
    if (currentItem.expiryDate) {
      formData.append('ExpiryDate', currentItem.expiryDate);
    }
    
    if (currentItem.image) formData.append('Image', currentItem.image);

    try {
      const url = currentItem.id 
        ? `https://neama1.runasp.net/Api/BranchDashboard/items/${currentItem.id}` 
        : `https://neama1.runasp.net/Api/BranchDashboard/items`;
      
      await fetch(url, {
        method: currentItem.id ? 'PUT' : 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      
      setShowItemModal(false);
      fetchItems(searchQuery);
    } catch (err) { console.error(err); }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await fetch(`https://neama1.runasp.net/Api/BranchDashboard/items/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
      });
      fetchItems(searchQuery);
    } catch (err) { console.error(err); }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'inherit' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ textAlign: 'right' }}>
          
          <h2 style={{ color: '#1e293b', margin: '0 0 5px 0', fontSize: '24px' }}>قائمة المنتجات 📦</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>إدارة الأقسام والمنتجات المعروضة في فرعك</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setCurrentCategory({ id: null, name: '' }); setShowCategoryModal(true); }} style={{ background: 'white', color: '#0f766e', border: '1px solid #0f766e', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + إضافة قسم
          </button>
          <button onClick={() => { 
            setCurrentItem({ id: null, name: '', description: '', originalPrice: '', discountPrice: '', stockQuantity: '', expiryDate: '', categoryId: categories[0]?.id || '', image: null }); 
            setShowItemModal(true); 
          } } style={{ background: '#0f766e', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + إضافة منتج
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="ابحث عن منتج بالاسم..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchItems(searchQuery)}
          style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', textAlign: 'right', fontSize: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
        />
        <button 
          onClick={() => fetchItems(searchQuery)} 
          style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          بحث 🔍
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '30px' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 'bold', color: '#334155' }}>{cat.name}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setCurrentCategory(cat); setShowCategoryModal(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', fontSize: '14px', padding: 0 }}>✏️</button>
              <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', padding: 0 }}>❌</button>
            </div>
          </div>
        ))}
      </div>

      {loadingItems ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>جاري البحث وتحديث القائمة... ⏳</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ position: 'relative', height: '200px', background: '#f1f5f9' }}>
                <img src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', color: '#0f766e', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                  {item.categoryName}
                </span>
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: item.stockQuantity > 0 ? '#10b981' : '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                  {item.stockQuantity > 0 ? `بالمخزن: ${item.stockQuantity}` : 'نفذت الكمية'}
                </span>
              </div>
              
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '18px' }}>{item.name}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.6', flex: 1 }}>{item.description}</p>
                
                {item.expiryDate && (
                  <p style={{ margin: '0 0 15px 0', color: '#ea580c', fontSize: '12px', fontWeight: 'bold', background: '#fffedd', padding: '5px', borderRadius: '5px', display: 'inline-block', alignSelf: 'center' }}>
                    ⏳ تاريخ الصلاحية: {new Date(item.expiryDate).toLocaleDateString('ar-EG')}
                  </p>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ color: '#1e293b', fontWeight: 'bold', fontSize: '18px', marginLeft: '10px' }}>{item.discountPrice} ج.م</span>
                  {item.originalPrice > item.discountPrice && (
                    <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: '14px' }}>{item.originalPrice} ج.م</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setCurrentItem({ ...item, categoryId: categories.find(c => c.name === item.categoryName)?.id, image: null }); setShowItemModal(true); }} style={{ flex: 1, padding: '10px', background: '#f0f9ff', color: '#0ea5e9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                    تعديل ✏️
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} style={{ flex: 1, padding: '10px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                    حذف 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>لا توجد منتجات تطابق بحثك.</div>}
        </div>
      )}

      {showCategoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>{currentCategory.id ? 'تعديل القسم' : 'إضافة قسم جديد'}</h3>
            <form onSubmit={handleSaveCategory}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>اسم القسم</label>
                <input required type="text" value={currentCategory.name} onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#0f766e', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ</button>
                <button type="button" onClick={() => setShowCategoryModal(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              {currentItem.id ? 'تعديل المنتج ✏️' : 'إضافة منتج جديد '}
            </h3>
            <form onSubmit={handleSaveItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>اسم المنتج</label>
                <input required type="text" value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>الوصف</label>
                <textarea required value={currentItem.description} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>السعر الأصلي</label>
                <input required type="number" value={currentItem.originalPrice} onChange={(e) => setCurrentItem({...currentItem, originalPrice: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>سعر الخصم</label>
                <input required type="number" value={currentItem.discountPrice} onChange={(e) => setCurrentItem({...currentItem, discountPrice: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>الكمية في المخزن</label>
                <input required type="number" value={currentItem.stockQuantity} onChange={(e) => setCurrentItem({...currentItem, stockQuantity: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>القسم</label>
                <select required value={currentItem.categoryId} onChange={(e) => setCurrentItem({...currentItem, categoryId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                  <option value="" disabled>اختر القسم</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>تاريخ الصلاحية (اختياري)</label>
                <input type="date" value={currentItem.expiryDate || ''} onChange={(e) => setCurrentItem({...currentItem, expiryDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#475569' }}>صورة المنتج</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setCurrentItem({...currentItem, image: e.target.files[0]})} style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px dashed #0f766e', background: '#f0fdfa' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" style={{ flex: 1, background: '#0f766e', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>حفظ</button>
                <button type="button" onClick={() => setShowItemModal(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}