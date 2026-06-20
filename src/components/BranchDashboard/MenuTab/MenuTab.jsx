import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MenuTab.css';

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
    <div className="menu-tab-wrapper">
      
      <div className="menu-header-row">
        <div className="menu-header-titles">
          <h2 className="menu-main-title">قائمة المنتجات 📦</h2>
          <p className="menu-subtitle">إدارة الأقسام والمنتجات المعروضة في فرعك</p>
        </div>
        <div className="menu-actions-group">
          <button onClick={() => { setCurrentCategory({ id: null, name: '' }); setShowCategoryModal(true); }} className="menu-action-btn-o">
            + إضافة قسم
          </button>
          <button onClick={() => { 
            setCurrentItem({ id: null, name: '', description: '', originalPrice: '', discountPrice: '', stockQuantity: '', expiryDate: '', categoryId: categories[0]?.id || '', image: null }); 
            setShowItemModal(true); 
          } } className="menu-action-btn-s">
            + إضافة منتج
          </button>
        </div>
      </div>

      <div className="menu-search-row">
        <input 
          type="text" 
          placeholder="ابحث عن منتج بالاسم..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchItems(searchQuery)}
          className="menu-search-input"
        />
        <button 
          onClick={() => fetchItems(searchQuery)} 
          className="menu-search-btn"
        >
          بحث 🔍
        </button>
      </div>

      <div className="categories-horizontal-scroll">
        {categories.map(cat => (
          <div key={cat.id} className="category-pill-card">
            <span className="category-pill-label">{cat.name}</span>
            <div className="category-pill-actions">
              <button onClick={() => { setCurrentCategory(cat); setShowCategoryModal(true); }} className="cat-pill-edit-btn">✏️</button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="cat-pill-del-btn">❌</button>
            </div>
          </div>
        ))}
      </div>

      {loadingItems ? (
        <div className="menu-loading-state">جاري البحث وتحديث القائمة... ⏳</div>
      ) : (
        <div className="items-grid-wrapper">
          {items.map(item => (
            <div key={item.id} className="item-card-modern">
              
              <div className="item-img-container">
                <img src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.name} className="item-card-img" />
                <span className="item-badge-category">
                  {item.categoryName}
                </span>
                <span className={`item-badge-stock ${item.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {item.stockQuantity > 0 ? `بالمخزن: ${item.stockQuantity}` : 'نفذت الكمية'}
                </span>
              </div>
              
              <div className="item-body-content">
                <h3 className="item-title-text">{item.name}</h3>
                <p className="item-desc-text">{item.description}</p>
                
                {item.expiryDate && (
                  <p className="item-expiry-badge">
                    ⏳ تاريخ الصلاحية: {new Date(item.expiryDate).toLocaleDateString('ar-EG')}
                  </p>
                )}

                <div className="item-price-wrapper">
                  <span className="item-discount-price">{item.discountPrice} ج.م</span>
                  {item.originalPrice > item.discountPrice && (
                    <span className="item-original-price">{item.originalPrice} ج.م</span>
                  )}
                </div>

                <div className="item-card-actions">
                  <button onClick={() => { setCurrentItem({ ...item, categoryId: categories.find(c => c.name === item.categoryName)?.id, image: null }); setShowItemModal(true); }} className="item-edit-action-btn">
                    تعديل ✏️
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} className="item-delete-action-btn">
                    حذف 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="empty-search-result">لا توجد منتجات تطابق بحثك.</div>}
        </div>
      )}

      {showCategoryModal && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal-box">
            <h3 className="modal-form-title">{currentCategory.id ? 'تعديل القسم' : 'إضافة قسم جديد'}</h3>
            <form onSubmit={handleSaveCategory}>
              <div className="modal-input-group">
                <label className="modal-form-label">اسم القسم</label>
                <input required type="text" value={currentCategory.name} onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})} className="modal-text-input" />
              </div>
              <div className="modal-action-button-row">
                <button type="submit" className="modal-submit-btn">حفظ</button>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="modal-cancel-btn">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="dashboard-modal-overlay" style={{background: 'rgba(0,0,0,0.6)'}}>
          <div className="dashboard-modal-box wide-item-modal">
            <h3 className="modal-form-title bordered-bottom">
              {currentItem.id ? 'تعديل المنتج ✏️' : 'إضافة منتج جديد '}
            </h3>
            <form onSubmit={handleSaveItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="modal-form-label">اسم المنتج</label>
                <input required type="text" value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} className="modal-text-input" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="modal-form-label">الوصف</label>
                <textarea required value={currentItem.description} onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})} rows="3" className="modal-textarea-input" />
              </div>
              <div>
                <label className="modal-form-label">السعر الأصلي</label>
                <input required type="number" value={currentItem.originalPrice} onChange={(e) => setCurrentItem({...currentItem, originalPrice: e.target.value})} className="modal-text-input" />
              </div>
              <div>
                <label className="modal-form-label">سعر الخصم</label>
                <input required type="number" value={currentItem.discountPrice} onChange={(e) => setCurrentItem({...currentItem, discountPrice: e.target.value})} className="modal-text-input" />
              </div>
              <div>
                <label className="modal-form-label">الكمية في المخزن</label>
                <input required type="number" value={currentItem.stockQuantity} onChange={(e) => setCurrentItem({...currentItem, stockQuantity: e.target.value})} className="modal-text-input" />
              </div>
              <div>
                <label className="modal-form-label">القسم</label>
                <select required value={currentItem.categoryId} onChange={(e) => setCurrentItem({...currentItem, categoryId: e.target.value})} className="modal-select-input" style={{background: 'white'}}>
                  <option value="" disabled>اختر القسم</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="modal-form-label">تاريخ الصلاحية (اختياري)</label>
                <input type="date" value={currentItem.expiryDate || ''} onChange={(e) => setCurrentItem({...currentItem, expiryDate: e.target.value})} className="modal-text-input" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="modal-form-label">صورة المنتج</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => setCurrentItem({...currentItem, image: e.target.files[0]})} style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px dashed #0f766e', background: '#f0fdfa', boxSizing: 'border-box' }} />
              </div>
              <div className="modal-action-button-row" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="modal-submit-btn">حفظ</button>
                <button type="button" onClick={() => setShowItemModal(false)} className="modal-cancel-btn">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}