import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './PartnerStatisticsTab.css';

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
    <div className="partner-stats-wrapper">
      
      <div className="partner-stats-header">
        <h2 className="partner-stats-title">📊 ملخص أداء النشاط</h2>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="partner-time-filter"
        >
          <option value="0">كل الوقت</option>
          <option value="1">اليوم</option>
          <option value="2">هذا الشهر</option>
          <option value="3">هذا العام</option>
        </select>
      </div>

      <div className="partner-kpi-grid">
        {[
          { title: 'إجمالي الفروع', value: stats?.totalBranches || 0, color: 'indigo', icon: '🏢' },
          { title: 'العناصر المباعة', value: stats?.totalSoldItems || 0, color: 'teal', icon: '📦' },
          { title: 'إجمالي المبيعات', value: `${stats?.totalSales || 0} ج.م`, color: 'green', icon: '💰' },
          { title: 'صافي الربح', value: `${stats?.netProfit || 0} ج.م`, color: 'blue', icon: '📈' },
          { title: 'رصيد المحفظة', value: `${stats?.walletBalance || 0} ج.م`, color: 'orange', icon: '💳' }
        ].map((item, index) => (
          <div key={index} className={`partner-kpi-card ${item.color}`}>
            <div className="partner-kpi-icon">{item.icon}</div>
            <p className="partner-kpi-title">{item.title}</p>
            <h3 className="partner-kpi-value">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="partner-charts-grid">
        
        <div className="partner-chart-card">
          <div className="partner-chart-header">
            <h3 className="partner-chart-heading">📈 معدل نمو الأرباح</h3>
            <input 
              type="number" 
              value={profitYear} 
              onChange={(e) => setProfitYear(e.target.value)}
              className="partner-year-input"
            />
          </div>
          {loadingProfit ? (
            <div className="chart-loader-box">جاري التحميل...</div>
          ) : (
            <div className="chart-responsive-box" dir="ltr">
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

        <div className="partner-chart-card">
          <div className="partner-chart-header">
            <h3 className="partner-chart-heading">🌱 معدل إنقاذ الوجبات</h3>
            <input 
              type="number" 
              value={itemsYear} 
              onChange={(e) => setItemsYear(e.target.value)}
              className="partner-year-input"
            />
          </div>
          {loadingItems ? (
            <div className="chart-loader-box">جاري التحميل...</div>
          ) : (
            <div className="chart-responsive-box" dir="ltr">
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