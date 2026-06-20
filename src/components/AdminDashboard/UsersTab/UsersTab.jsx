import React, { useState, useEffect } from 'react';
import './UsersTab.css';

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
    <div className="users-tab-container">
      <h3 className="users-tab-title">👥 المستخدمين المسجلين</h3>
      {loading ? <p className="users-loading-msg">جاري سحب البيانات...</p> : (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>الإيميل</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className="user-name-cell">{u.displayName}</td>
                <td className="user-email-cell" dir="ltr">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}