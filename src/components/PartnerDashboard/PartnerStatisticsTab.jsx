import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthNames = {
  jan: 'يناير', feb: 'فبراير', mar: 'مارس', apr: 'أبريل',
  may: 'مايو', jun: 'يونيو', jul: 'يوليو', aug: 'أغسطس',
  sep: 'سبتمبر', oct: 'أكتوبر', nov: 'نوفمبر', dec: 'ديسمبر'
};

export default function PartnerStatisticsTab({ selectedBranch }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('0');

  const [profitChartData, setProfitChartData] = useState([]);
  const [profitYear, setProfitYear] = useState(new Date().getFullYear());
  const [loadingProfit, setLoadingProfit] = useState(false);

  const [itemsChartData, setItemsChartData] = useState([]);
  const [itemsYear, setItemsYear] = useState(new Date().getFullYear());
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const queryParams = new URLSearchParams();
        queryParams.append('filter', timeFilter);
        
        if (selectedBranch && selectedBranch !== 'all') {
          queryParams.append('branchId', selectedBranch);
        }

        const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/reports?${queryParams.toString()}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedBranch, timeFilter]);

  useEffect(() => {
    const fetchProfitGrowth = async () => {
      setLoadingProfit(true);
      try {
        const token = localStorage.getItem("userToken");
        const queryParams = new URLSearchParams();
        queryParams.append('year', profitYear);
        
        if (selectedBranch && selectedBranch !== 'all') {
          queryParams.append('branchId', selectedBranch);
        }

        const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/profitgrowth?${queryParams.toString()}`, {
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
  }, [selectedBranch, profitYear]);

  useEffect(() => {
    const fetchItemsGrowth = async () => {
      setLoadingItems(true);
      try {
        const token = localStorage.getItem("userToken");
        const queryParams = new URLSearchParams();
        queryParams.append('year', itemsYear);
        
        if (selectedBranch && selectedBranch !== 'all') {
          queryParams.append('branchId', selectedBranch);
        }

        const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/itemsgrowth?${queryParams.toString()}`, {
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
  }, [selectedBranch, itemsYear]);

  if (loading && !stats) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحميل الإحصائيات... ⏳</div>;

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>📊 ملخص أداء النشاط</h2>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', backgroundColor: 'white', color: '#1e293b', fontSize: '14px', fontWeight: 'bold' }}
        >
          <option value="0">كل الوقت</option>
          <option value="1">اليوم</option>
          <option value="2">هذا الشهر</option>
          <option value="3">هذا العام</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { title: 'إجمالي الفروع', value: stats?.totalBranches || 0, color: '#4f46e5', icon: '🏢' },
          { title: 'العناصر المباعة', value: stats?.totalSoldItems || 0, color: '#0f766e', icon: '📦' },
          { title: 'إجمالي المبيعات', value: `${stats?.totalSales || 0} ج.م`, color: '#15803d', icon: '💰' },
          { title: 'صافي الربح', value: `${stats?.netProfit || 0} ج.م`, color: '#0369a1', icon: '📈' },
          { title: 'رصيد المحفظة', value: `${stats?.walletBalance || 0} ج.م`, color: '#b45309', icon: '💳' }
        ].map((item, index) => (
          <div key={index} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRight: `5px solid ${item.color}` }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{item.title}</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '22px' }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1e293b', margin: 0 }}>📈 معدل نمو الأرباح</h3>
            <input 
              type="number" 
              value={profitYear} 
              onChange={(e) => setProfitYear(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '80px', textAlign: 'center' }}
            />
          </div>
          {loadingProfit ? (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>جاري التحميل...</div>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#0369a1" strokeWidth={3} dot={{ r: 4 }} name="الربح (ج.م)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1e293b', margin: 0 }}>🌱 معدل إنقاذ الوجبات</h3>
            <input 
              type="number" 
              value={itemsYear} 
              onChange={(e) => setItemsYear(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '80px', textAlign: 'center' }}
            />
          </div>
          {loadingItems ? (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>جاري التحميل...</div>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} barSize={30} name="وجبة" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}