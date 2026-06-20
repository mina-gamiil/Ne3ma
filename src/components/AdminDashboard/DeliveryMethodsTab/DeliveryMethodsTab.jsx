import React, { useState, useEffect } from 'react';
import './DeliveryMethodsTab.css';

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
    <div className="delivery-methods-wrapper">
      <div className="delivery-header">
        <h3 className="delivery-title">🚚 طرق التوصيل</h3>
      </div>

      <div className="table-container">
        <table className="delivery-table">
          <thead>
            <tr className="delivery-thead-tr">
              <th className="delivery-th">الاسم</th>
              <th className="delivery-th">الوصف</th>
              <th className="delivery-th">التكلفة</th>
              <th className="delivery-th">الوقت</th>
              <th className="delivery-th">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.id} className="delivery-tr">
                <td className="delivery-td">{m.shortName}</td>
                <td className="delivery-td-desc">{m.description}</td>
                <td className="delivery-td-cost">{m.cost} EGP</td>
                <td className="delivery-td">{m.deliveryTime}</td>
                <td className="delivery-td">
                  <button 
                    onClick={() => { setEditingMethod(m); setFormData(m); }}
                    className="edit-method-btn"
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
        <div className="modal-overlay">
          <form onSubmit={handleUpdate} className="modal-content">
            <h3 className="modal-title">
              ✏️ تعديل طريقة التوصيل
            </h3>
            
            <label className="modal-label">الاسم:</label>
            <input 
              className="modal-input"
              value={formData.shortName} 
              onChange={e => setFormData({...formData, shortName: e.target.value})} 
              required 
            />

            <label className="modal-label">الوصف:</label>
            <textarea 
              className="modal-textarea"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
            />

            <div className="modal-row">
              <div className="modal-col">
                <label className="modal-label">التكلفة:</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="modal-input"
                  value={formData.cost} 
                  onChange={e => setFormData({...formData, cost: e.target.value})} 
                  required 
                />
              </div>
              <div className="modal-col">
                <label className="modal-label">الوقت المتوقع:</label>
                <input 
                  className="modal-input"
                  value={formData.deliveryTime} 
                  onChange={e => setFormData({...formData, deliveryTime: e.target.value})} 
                  required 
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="submit" className="modal-save-btn">
                💾 حفظ التعديلات
              </button>
              <button type="button" onClick={() => setEditingMethod(null)} className="modal-cancel-btn">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}