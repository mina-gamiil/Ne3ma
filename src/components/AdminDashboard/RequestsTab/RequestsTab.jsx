import React, { useState, useEffect } from 'react';
import './RequestsTab.css';

export default function RequestsTab({ setPendingCount }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reqFilter, setReqFilter] = useState('waiting');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken"); 
        let url = "https://neama1.runasp.net/Api/AdminDashboard/ApplicationsToJoin";
        if (reqFilter === 'waiting') url += "?ContactWasMade=false";
        else if (reqFilter === 'contacted') url += "?ContactWasMade=true";

        const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" } });
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
          if (reqFilter === 'waiting') setPendingCount(data.length);
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchRequests();
  }, [reqFilter, setPendingCount]);

  const handleMarkContacted = async (id) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/mark-contacted/${id}`, {
        method: "PUT", headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" }
      });
      if (response.ok) {
        alert("تم التحديث! ✅");
        if (reqFilter === 'waiting') setRequests(prev => prev.filter(req => req.id !== id));
        setPendingCount(prev => Math.max(0, prev - 1));
      } else { alert("خطأ."); }
    } catch (error) { alert("تعذر الاتصال."); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="requests-container">
      <h3 className="requests-title">متابعة طلبات المتاجر</h3>
      
      <div className="filters-group">
        <button 
          className={`filter-btn ${reqFilter === 'waiting' ? 'active' : 'inactive'}`} 
          onClick={() => setReqFilter('waiting')}
        >
          ⏳ في الانتظار
        </button>
        <button 
          className={`filter-btn ${reqFilter === 'contacted' ? 'active' : 'inactive'}`} 
          onClick={() => setReqFilter('contacted')}
        >
          ✅ تم التواصل
        </button>
      </div>

      {loading ? (
        <p className="msg-text msg-loading">جاري سحب الطلبات...</p>
      ) : requests.length === 0 ? (
        <p className="msg-text msg-empty">لا توجد طلبات هنا! 🎉</p>
      ) : (
        <div className="table-responsive">
          <table className="requests-table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>اسم المسؤول</th>
                <th>النشاط</th>
                <th>الموبايل</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>{formatDate(req.createdAt)}</td>
                  <td>{req.fullName}</td>
                  <td><b>{req.placeName}</b></td>
                  <td dir="ltr" style={{ color: '#64748b' }}>{req.phone}</td>
                  <td>
                    {req.contactWasMade ? (
                      <span className="status-badge contacted">تم التواصل</span>
                    ) : (
                      <span className="status-badge waiting">في الانتظار</span>
                    )}
                  </td>
                  <td>
                    {!req.contactWasMade ? (
                      <button className="approve-btn" onClick={() => handleMarkContacted(req.id)}>
                        تأكيد التواصل ✔
                      </button>
                    ) : (
                      <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>مكتمل</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}