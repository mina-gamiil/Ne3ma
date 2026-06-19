import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = {
  jan: 'يناير', feb: 'فبراير', mar: 'مارس', apr: 'أبريل',
  may: 'مايو', jun: 'يونيو', jul: 'يوليو', aug: 'أغسطس',
  sep: 'سبتمبر', oct: 'أكتوبر', nov: 'نوفمبر', dec: 'ديسمبر'
};

export default function BranchStatisticsTab() {
  const [reportStats, setReportStats] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [timeFilter, setTimeFilter] = useState('0');

  const [profitChartData, setProfitChartData] = useState([]);
  const [profitYear, setProfitYear] = useState(new Date().getFullYear());
  const [loadingProfit, setLoadingProfit] = useState(false);

  const [itemsChartData, setItemsChartData] = useState([]);
  const [itemsYear, setItemsYear] = useState(new Date().getFullYear());
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoadingReport(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/report?filter=${timeFilter}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setReportStats(data);
        }
      } catch (err) {
        console.error("Error fetching branch report", err);
      } finally {
        setLoadingReport(false);
      }
    };
    fetchReport();
  }, [timeFilter]);

  useEffect(() => {
    const fetchProfitGrowth = async () => {
      setLoadingProfit(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/profitgrowth?year=${profitYear}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const result = await res.json();
          const formatted = Object.keys(result).map(key => ({
            name: monthNames[key],
            value: result[key]
          }));
          setProfitChartData(formatted);
        }
      } catch (err) {
        console.error("Error fetching profit growth", err);
      } finally {
        setLoadingProfit(false);
      }
    };
    fetchProfitGrowth();
  }, [profitYear]);

  useEffect(() => {
    const fetchItemsGrowth = async () => {
      setLoadingItems(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/itemsgrowth?year=${itemsYear}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const result = await res.json();
          const formatted = Object.keys(result).map(key => ({
            name: monthNames[key],
            value: result[key]
          }));
          setItemsChartData(formatted);
        }
      } catch (err) {
        console.error("Error fetching items growth", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItemsGrowth();
  }, [itemsYear]);

  if (loadingReport && !reportStats) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>جاري تحميل إحصائيات الفرع... ⏳</div>;

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 إحصائيات أداء الفرع
          </h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>نظرة سريعة على المبيعات والأرباح المحققة</p>
        </div>
        
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', backgroundColor: 'white', color: '#1e293b', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          <option value="0">كل الوقت</option>
          <option value="1">اليوم</option>
          <option value="2">هذا الشهر</option>
          <option value="3">هذا العام</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { title: 'إجمالي المبيعات', value: `${reportStats?.totalSales || 0} ج.م`, color: '#047857', icon: '💰' },
          { title: 'إجمالي الأرباح', value: `${reportStats?.totalProfits || 0} ج.م`, color: '#0369a1', icon: '📈' },
          { title: 'الطلبات المكتملة', value: `${reportStats?.completedOrdersCount || 0} طلب`, color: '#10b981', icon: '✅' },
          { title: 'المنتجات المعروضة', value: `${reportStats?.displayedItemsCount || 0} منتج`, color: '#6366f1', icon: '📦' }
        ].map((item, index) => (
          <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', borderRight: `5px solid ${item.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>{item.icon}</div>
            <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '15px', fontWeight: 'bold' }}>{item.title}</p>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1e293b', margin: 0, fontSize: '16px' }}>📈 معدل نمو الأرباح</h3>
            <input 
              type="number" 
              value={profitYear} 
              onChange={(e) => setProfitYear(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '70px', textAlign: 'center', fontSize: '13px' }}
            />
          </div>
          {loadingProfit ? (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>جاري التحميل...</div>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#0369a1" strokeWidth={3} dot={{ r: 4, fill: '#0369a1', strokeWidth: 2, stroke: 'white' }} name="الأرباح (ج.م)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1e293b', margin: 0, fontSize: '16px' }}>📦 معدل نمو المنتجات</h3>
            <input 
              type="number" 
              value={itemsYear} 
              onChange={(e) => setItemsYear(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '70px', textAlign: 'center', fontSize: '13px' }}
            />
          </div>
          {loadingItems ? (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>جاري التحميل...</div>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={25} name="منتج" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}