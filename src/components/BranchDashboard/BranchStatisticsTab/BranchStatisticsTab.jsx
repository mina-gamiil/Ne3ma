import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './BranchStatisticsTab.css';

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

  if (loadingReport && !reportStats) return <div className="branch-stats-loading">جاري تحميل إحصائيات الفرع... ⏳</div>;

  return (
    <div className="branch-stats-wrapper">
      
      <div className="branch-stats-header">
        <div>
          <h2 className="branch-stats-heading">
            📊 إحصائيات أداء الفرع
          </h2>
          <p className="branch-stats-subtitle">نظرة سريعة على المبيعات والأرباح المحققة</p>
        </div>
        
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="branch-time-select"
        >
          <option value="0">كل الوقت</option>
          <option value="1">اليوم</option>
          <option value="2">هذا الشهر</option>
          <option value="3">هذا العام</option>
        </select>
      </div>

      <div className="branch-kpis-grid">
        {[
          { title: 'إجمالي المبيعات', value: `${reportStats?.totalSales || 0} ج.م`, color: 'emerald', icon: '💰' },
          { title: 'إجمالي الأرباح', value: `${reportStats?.totalProfits || 0} ج.م`, color: 'sky', icon: '📈' },
          { title: 'الطلبات المكتملة', value: `${reportStats?.completedOrdersCount || 0} طلب`, color: 'mint', icon: '✅' },
          { title: 'المنتجات المعروضة', value: `${reportStats?.displayedItemsCount || 0} منتج`, color: 'indigo', icon: '📦' }
        ].map((item, index) => (
          <div key={index} className={`branch-kpi-card ${item.color}`}>
            <div className="branch-kpi-icon">{item.icon}</div>
            <p className="branch-kpi-title">{item.title}</p>
            <h3 className="branch-kpi-value">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="branch-charts-grid">
        
        <div className="branch-chart-card">
          <div className="branch-chart-header">
            <h3 className="branch-chart-title">📈 معدل نمو الأرباح</h3>
            <input 
              type="number" 
              value={profitYear} 
              onChange={(e) => setProfitYear(e.target.value)}
              className="branch-chart-year-input"
            />
          </div>
          {loadingProfit ? (
            <div className="branch-chart-loader">جاري التحميل...</div>
          ) : (
            <div className="branch-chart-container" dir="ltr">
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

        <div className="branch-chart-card">
          <div className="branch-chart-header">
            <h3 className="branch-chart-title">📦 معدل نمو المنتجات</h3>
            <input 
              type="number" 
              value={itemsYear} 
              onChange={(e) => setItemsYear(e.target.value)}
              className="branch-chart-year-input"
            />
          </div>
          {loadingItems ? (
            <div className="branch-chart-loader">جاري التحميل...</div>
          ) : (
            <div className="branch-chart-container" dir="ltr">
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