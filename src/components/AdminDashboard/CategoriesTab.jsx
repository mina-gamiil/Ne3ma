import React, { useState, useEffect, useCallback } from 'react';

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
    <div style={{ padding: '25px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>🏷️ إدارة الأقسام</h3>
        <button 
          onClick={() => { setEditingCategory(null); setCategoryName(''); setCategoryIcon(null); setShowModal(true); }}
          style={{ background: '#0f766e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ➕ إضافة قسم جديد
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
        {categoriesList.map(cat => (
          <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <img src={cat.iconURL} style={{ width: '70px', height: '70px', objectFit: 'contain', marginBottom: '10px' }} alt={cat.name} />
            <p style={{ fontWeight: 'bold', margin: '10px 0', color: '#334155' }}>{cat.name}</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
              <button 
                onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); setCategoryIcon(null); setShowModal(true); }}
                style={{ flex: 1, background: '#f8fafc', color: '#0369a1', border: '1px solid #bae6fd', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
              >تعديل</button>
              
              <button 
                onClick={() => deleteCategory(cat.id)}
                style={{ flex: 1, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
              >حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 }}>
          <form onSubmit={handleSave} style={{ background:'white', padding:'30px', borderRadius:'15px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#1e293b' }}>
              {editingCategory ? "✏️ تعديل القسم" : "✨ إضافة قسم جديد"}
            </h3>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>اسم القسم:</label>
            <input 
              style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
              value={categoryName} 
              onChange={e => setCategoryName(e.target.value)} 
              required 
            />
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>أيقونة القسم:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setCategoryIcon(e.target.files[0])} 
              style={{ width: '100%', marginBottom: '25px', padding: '5px' }} 
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={saving} style={{ flex: 2, background: '#0f766e', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {saving ? "⏳ جاري الحفظ..." : "💾 حفظ"}
              </button>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#e2e8f0', color: '#475569', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}