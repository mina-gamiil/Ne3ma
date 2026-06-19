import React, { useState, useEffect } from 'react';

export default function DeliveryMethodsTab() {
  const [methods, setMethods] = useState([]);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({ shortName: '', description: '', cost: '', deliveryTime: '' });

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = async () => {
    try {
      const res = await fetch("https://neama1.runasp.net/Api/Orders/deliveryMethod", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("userToken")}` }
      });
      if (res.ok) setMethods(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://neama1.runasp.net/Api/AdminDashboard/deliverymethod", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            id: editingMethod.id, 
            shortName: formData.shortName,
            description: formData.description,
            cost: parseFloat(formData.cost),
            deliveryTime: formData.deliveryTime 
        })
      });
      
      if (response.ok) {
        alert("تم التعديل بنجاح! ✅");
        setEditingMethod(null);
        fetchMethods();
      } else {
        const err = await response.text();
        alert("خطأ: " + err);
      }
    } catch (err) { alert("حدث خطأ في الاتصال"); }
  };

  return (
    <div style={{ padding: '25px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>🚚 طرق التوصيل</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 15px', color: '#334155', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold' }}>الاسم</th>
              <th style={{ padding: '12px 15px', color: '#334155', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold' }}>الوصف</th>
              <th style={{ padding: '12px 15px', color: '#334155', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold' }}>التكلفة</th>
              <th style={{ padding: '12px 15px', color: '#334155', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold' }}>الوقت</th>
              <th style={{ padding: '12px 15px', color: '#334155', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '15px', color: '#475569', fontWeight: '500' }}>{m.shortName}</td>
                <td style={{ padding: '15px', color: '#64748b' }}>{m.description}</td>
                <td style={{ padding: '15px', color: '#0f766e', fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>{m.cost} EGP</td>
                <td style={{ padding: '15px', color: '#475569' }}>{m.deliveryTime}</td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => { setEditingMethod(m); setFormData(m); }}
                    style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
                  >
                    ✏️ تعديل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingMethod && (
        <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdate} style={{ background:'white', padding:'30px', borderRadius:'15px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#1e293b' }}>
              ✏️ تعديل طريقة التوصيل
            </h3>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>الاسم:</label>
            <input 
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
              value={formData.shortName} 
              onChange={e => setFormData({...formData, shortName: e.target.value})} 
              required 
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>الوصف:</label>
            <textarea 
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
            />

            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>التكلفة:</label>
                <input 
                  type="number" 
                  step="0.01"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                  value={formData.cost} 
                  onChange={e => setFormData({...formData, cost: e.target.value})} 
                  required 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>الوقت المتوقع:</label>
                <input 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                  value={formData.deliveryTime} 
                  onChange={e => setFormData({...formData, deliveryTime: e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 2, background: '#0f766e', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                💾 حفظ التعديلات
              </button>
              <button type="button" onClick={() => setEditingMethod(null)} style={{ flex: 1, background: '#e2e8f0', color: '#475569', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}