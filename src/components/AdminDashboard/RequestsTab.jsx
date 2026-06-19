import React, { useState, useEffect } from 'react';

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
          if (reqFilter === 'waiting') setPendingCount(data.length); // تحديث العداد
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

  const styles = {
    container: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
    th: { padding: '14px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '700', borderBottom: '2px solid #e2e8f0' },
    td: { padding: '14px', borderBottom: '1px solid #e2e8f0', color: '#334155', fontSize: '14px' },
    approveBtn: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    reqFilterBtn: (isActive) => ({ padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', border: 'none', backgroundColor: isActive ? '#0f766e' : '#e2e8f0', color: isActive ? 'white' : '#475569', marginLeft: '10px' }),
  };

  return (
    <div style={styles.container}>
      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>متابعة طلبات المتاجر</h3>
      <div style={{ marginBottom: '20px' }}>
        <button style={styles.reqFilterBtn(reqFilter === 'waiting')} onClick={() => setReqFilter('waiting')}>⏳ في الانتظار</button>
        <button style={styles.reqFilterBtn(reqFilter === 'contacted')} onClick={() => setReqFilter('contacted')}>✅ تم التواصل</button>
      </div>
      {loading ? <p>جاري سحب الطلبات...</p> : requests.length === 0 ? <p style={{color: '#10b981', fontWeight: 'bold'}}>لا توجد طلبات هنا! 🎉</p> : (
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>التاريخ</th><th style={styles.th}>اسم المسؤول</th><th style={styles.th}>النشاط</th><th style={styles.th}>الموبايل</th><th style={styles.th}>الحالة</th><th style={styles.th}>الإجراءات</th></tr></thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td style={styles.td}>{formatDate(req.createdAt)}</td><td style={styles.td}>{req.fullName}</td><td style={styles.td}><b>{req.placeName}</b></td><td style={styles.td} dir="ltr">{req.phone}</td>
                <td style={styles.td}>{req.contactWasMade ? <span style={{color: 'green'}}>تم التواصل</span> : <span style={{color: 'orange'}}>في الانتظار</span>}</td>
                <td style={styles.td}>{!req.contactWasMade ? <button style={styles.approveBtn} onClick={() => handleMarkContacted(req.id)}>تأكيد التواصل ✔</button> : <span>مكتمل</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}