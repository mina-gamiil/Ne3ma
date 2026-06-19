import React, { useState, useEffect } from 'react';

export default function UsersTab() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("https://neama1.runasp.net/Api/AdminDashboard/AllUser", {
          method: "GET", headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setUsersList(await res.json());
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '25px', overflowX: 'auto' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>👥 المستخدمين المسجلين</h3>
      {loading ? <p>جاري سحب البيانات...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr><th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0' }}>#</th><th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0' }}>الاسم</th><th style={{ padding: '14px', borderBottom: '2px solid #e2e8f0' }}>الإيميل</th></tr>
          </thead>
          <tbody>
            {usersList.map((u, i) => (
              <tr key={i}>
                <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }}>{i + 1}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: '#0369a1' }}>{u.displayName}</td>
                <td style={{ padding: '14px', borderBottom: '1px solid #e2e8f0' }} dir="ltr">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}