import React, { useState, useEffect, useCallback } from 'react';
import './CategoriesTab.css';

export default function CategoriesTab() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("https://neama1.runasp.net/Api/MainSection", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
      });
      if (res.ok) setCategoriesList(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!editingCategory && !categoryIcon) {
      alert("⚠️ يرجى اختيار أيقونة للقسم الجديد!");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    
    formData.append('Name', categoryName);
    
    if (editingCategory) {
      formData.append('Id', editingCategory.id);
    }
    
    if (categoryIcon) {
      formData.append('IconURL', categoryIcon);
    }

    try {
      const res = await fetch("https://neama1.runasp.net/Api/AdminDashboard/mainsection", {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` },
        body: formData
      });
      
      if (res.ok) {
        alert("تم الحفظ بنجاح! ✅");
        setShowModal(false);
        fetchCategories(); 
      } else {
        const err = await res.text();
        alert(`حدث خطأ: ${err}`);
      }
    } catch (err) { alert("تعذر الاتصال بالسيرفر"); }
    finally { setSaving(false); }
  };

  const deleteCategory = async (id) => {
    if(!window.confirm("هل أنت متأكد من حذف هذا القسم؟ ⚠️")) return;
    try {
        const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/mainsection/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
        });
        if (res.ok) {
            fetchCategories();
        } else {
            alert("حدث خطأ أثناء الحذف");
        }
    } catch(err) { alert("حدث خطأ في الاتصال"); }
  };

  return (
    <div className="categories-wrapper">
      <div className="categories-header">
        <h3 className="categories-title">🏷️ إدارة الأقسام</h3>
        <button 
          className="add-category-btn"
          onClick={() => { setEditingCategory(null); setCategoryName(''); setCategoryIcon(null); setShowModal(true); }}
        >
          ➕ إضافة قسم جديد
        </button>
      </div>
      
      <div className="categories-grid">
        {categoriesList.map(cat => (
          <div key={cat.id} className="category-card">
            <img src={cat.iconURL} className="category-img" alt={cat.name} />
            <p className="category-name">{cat.name}</p>
            
            <div className="category-actions">
              <button 
                className="edit-btn"
                onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); setCategoryIcon(null); setShowModal(true); }}
              >تعديل</button>
              
              <button 
                className="delete-btn"
                onClick={() => deleteCategory(cat.id)}
              >حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form onSubmit={handleSave} className="modal-content">
            <h3 className="modal-title">
              {editingCategory ? "✏️ تعديل القسم" : "✨ إضافة قسم جديد"}
            </h3>
            
            <label className="modal-label">اسم القسم:</label>
            <input 
              className="modal-input"
              value={categoryName} 
              onChange={e => setCategoryName(e.target.value)} 
              required 
            />
            
            <label className="modal-label">أيقونة القسم:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setCategoryIcon(e.target.files[0])} 
              className="modal-file-input"
            />
            
            <div className="modal-actions-wrapper">
              <button type="submit" disabled={saving} className="modal-save-btn">
                {saving ? "⏳ جاري الحفظ..." : "💾 حفظ"}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="modal-cancel-btn">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}