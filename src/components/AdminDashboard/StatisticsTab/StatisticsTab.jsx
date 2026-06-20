import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StatisticsTab.css';

export default function StatisticsTab() {
  const [reportsData, setReportsData] = useState(null);
  const [reportsFilter, setReportsFilter] = useState("2");

  const [usersChartData, setUsersChartData] = useState([]);
  const [usersYear, setUsersYear] = useState(new Date().getFullYear());
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [itemsChartData, setItemsChartData] = useState([]);
  const [itemsYear, setItemsYear] = useState(new Date().getFullYear());
  const [loadingItems, setLoadingItems] = useState(false);

  const [profitChartData, setProfitChartData] = useState([]);
  const [profitYear, setProfitYear] = useState(new Date().getFullYear());
  const [loadingProfit, setLoadingProfit] = useState(false);

  const monthNames = {
    jan: 'يناير', feb: 'فبراير', mar: 'مارس', apr: 'أبريل',
    may: 'مايو', jun: 'يونيو', jul: 'يوليو', aug: 'أغسطس',
    sep: 'سبتمبر', oct: 'أكتوبر', nov: 'نوفمبر', dec: 'ديسمبر'
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/reports?filter=${reportsFilter}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setReportsData(await res.json());
      } catch (err) { console.error("خطأ تقارير:", err); }
    };
    fetchReports();
  }, [reportsFilter]);

  useEffect(() => {
    const fetchUsersGrowth = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/usersgrowth?year=${usersYear}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          const formatted = Object.keys(result).map(key => ({ name: monthNames[key], value: result[key] }));
          setUsersChartData(formatted);
        }
      } catch (err) { console.error(err); } 
      finally { setLoadingUsers(false); }
    };
    fetchUsersGrowth();
  }, [usersYear]);

  useEffect(() => {
    const fetchItemsGrowth = async () => {
      setLoadingItems(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/itemsgrowth?year=${itemsYear}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          const formatted = Object.keys(result).map(key => ({ name: monthNames[key], value: result[key] }));
          setItemsChartData(formatted);
        }
      } catch (err) { console.error(err); } 
      finally { setLoadingItems(false); }
    };
    fetchItemsGrowth();
  }, [itemsYear]);

  useEffect(() => {
    const fetchProfitGrowth = async () => {
      setLoadingProfit(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/profitgrowth?year=${profitYear}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          const formatted = Object.keys(result).map(key => ({ name: monthNames[key], value: result[key] }));
          setProfitChartData(formatted);
        }
      } catch (err) { console.error(err); } 
      finally { setLoadingProfit(false); }
    };
    fetchProfitGrowth();
  }, [profitYear]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
      <div>
        <p className="stat-card-title">{title}</p>
        <h3 className="stat-card-value">
          {value !== undefined ? value : '...'}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="stats-wrapper">
      
      <div className="stats-header">
        <h2 className="stats-main-title">📊 الإحصائيات العامة للمنصة</h2>
        <p className="stats-subtitle">نظرة شاملة على أداء ونمو التطبيق</p>
      </div>

      <div className="stats-filter-row">
        <h3 className="stats-filter-title">موجز الأرقام</h3>
        <select 
          value={reportsFilter} 
          onChange={(e) => setReportsFilter(e.target.value)}
          className="stats-select"
        >
          <option value="0">كل الوقت (All Time)</option>
          <option value="1">اليوم (Today)</option>
          <option value="2">هذا الشهر (This Month)</option>
          <option value="3">هذا العام (This Year)</option>
        </select>
      </div>

      <div className="stats-cards-grid">
        <StatCard title="إجمالي المستخدمين" value={reportsData?.totalUsers} icon="👥" color="#0f766e" />
        <StatCard title="الشركاء" value={reportsData?.totalPartners} icon="🏪" color="#3b82f6" />
        <StatCard title="الجمعيات الخيرية" value={reportsData?.totalCharities} icon="🤝" color="#8b5cf6" />
        <StatCard title="الوجبات المعروضة" value={reportsData?.totalOfferedMeals} icon="🍲" color="#f59e0b" />
        <StatCard title="الوجبات المُحفظة" value={reportsData?.totalSavedMeals} icon="♻️" color="#10b981" />
        <StatCard title="إجمالي الأرباح" value={reportsData ? `${reportsData.totalProfits} ج.م` : undefined} icon="💰" color="#ef4444" />
      </div>

      <div className="stats-charts-grid">
        
        <div className="chart-card">
          <div className="chart-header">
            <div><h3 className="chart-title teal">📈 نمو المستخدمين</h3></div>
            <select value={usersYear} onChange={(e) => setUsersYear(e.target.value)} className="chart-select teal">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          {loadingUsers ? <div className="chart-loader teal">جاري التحميل...</div> : (
            <div className="chart-container" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usersChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'right' }} itemStyle={{ color: '#0f766e', fontWeight: 'bold' }} formatter={(value) => [value, 'مستخدم 👤']} />
                  <Area type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#0f766e' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div><h3 className="chart-title green">♻️ معدل إنقاذ المنتجات</h3></div>
            <select value={itemsYear} onChange={(e) => setItemsYear(e.target.value)} className="chart-select green">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          {loadingItems ? <div className="chart-loader green">جاري التحميل...</div> : (
            <div className="chart-container" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={itemsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'right' }} itemStyle={{ color: '#10b981', fontWeight: 'bold' }} formatter={(value) => [value, 'منتج 🍲']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorItems)" activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div><h3 className="chart-title blue">💰 نمو الأرباح</h3></div>
            <select value={profitYear} onChange={(e) => setProfitYear(e.target.value)} className="chart-select blue">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          {loadingProfit ? <div className="chart-loader blue">جاري التحميل...</div> : (
            <div className="chart-container" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'right' }} itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }} formatter={(value) => [`${value} ج.م`, 'أرباح 💸']} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#3b82f6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}