import React, { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  0: { label: 'قيد الانتظار', color: '#f59e0b', bg: '#fef3c7', nextStatus: 3, actionLabel: 'بدء التحضير 🍳', actionColor: '#0ea5e9' },
  3: { label: 'قيد التحضير', color: '#0ea5e9', bg: '#e0f2fe', nextStatus: 4, actionLabel: 'خروج للتوصيل 🛵', actionColor: '#8b5cf6' },
  4: { label: 'في الطريق', color: '#8b5cf6', bg: '#ede9fe', nextStatus: 5, actionLabel: 'تأكيد التوصيل ✅', actionColor: '#10b981' },
  5: { label: 'مكتمل', color: '#10b981', bg: '#d1fae5', nextStatus: null, actionLabel: '', actionColor: '' }
};

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState(0);

  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/orders?status=${status}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG[activeStatus];
    const nextStatus = config?.nextStatus;
    
    if (nextStatus == null) return;

    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/orders/${orderId}/status?status=${nextStatus}`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        fetchOrders(activeStatus);
      } else {
        alert("حدث خطأ أثناء تحديث حالة الطلب.");
      }
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  const formatOrderDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('ar-EG');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'inherit', maxHeight: '100vh', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1e293b', margin: '0 0 5px 0', fontSize: '24px' }}>إدارة الطلبات 🛒</h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>متابعة تفاصيل الوجبات وعناوين التوصيل لكل حالة</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
          const statusNum = parseInt(statusKey);
          const isActive = activeStatus === statusNum;
          return (
            <button
              key={statusNum}
              onClick={() => setActiveStatus(statusNum)}
              style={{
                padding: '12px 25px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: isActive ? '#0f766e' : 'white',
                color: isActive ? 'white' : '#64748b',
                boxShadow: isActive ? '0 4px 10px rgba(15, 118, 110, 0.25)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>جاري تحميل الطلبات... ⏳</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px', paddingBottom: '50px' }}>
          {orders.map(order => {
            const orderConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG[activeStatus];
            
            return (
              <div key={order.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: `4px solid ${orderConfig.color}` }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>طلب #{order.id}</h3>
                    <small style={{ color: '#94a3b8', display: 'block', marginTop: '4px' }}>🕒 {formatOrderDate(order.orderDate)}</small>
                  </div>
                  <span style={{ background: orderConfig.bg, color: orderConfig.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {orderConfig.label}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed #cbd5e1' }}>
                  <span style={{ color: '#475569', fontSize: '13px', fontWeight: 'bold' }}>🔑 كود التحقق:</span>
                  <span style={{ color: '#0f766e', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px' }}>{order.verificationCode}</span>
                </div>

                <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', maxHeight: '160px', overflowY: 'auto', paddingLeft: '5px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px', fontWeight: 'bold', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>📦 العناصر المطلوبة:</p>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <img 
                        src={item.product?.pictureUrl || 'https://via.placeholder.com/40'} 
                        alt={item.product?.productName} 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#f1f5f9' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '14px' }}>{item.product?.productName}</h4>
                        <small style={{ color: '#64748b' }}>السعر: {item.price} ج.م</small>
                      </div>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                        {item.quantity}✕
                      </span>
                    </div>
                  ))}
                </div>

                {order.shippingAddress ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span>👤 العميل:</span>
                      <strong style={{ color: '#1e293b' }}>{order.shippingAddress.name}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span>📞 الهاتف:</span>
                      <strong style={{ color: '#1e293b' }}>{order.shippingAddress.phoneNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                      <span>📍 العنوان:</span>
                      <span style={{ color: '#1e293b', lineHeight: '1.4' }}>
                        {order.shippingAddress.displayName} 
                        {order.shippingAddress.distinctiveMark && (
                          <span style={{ display: 'block', color: '#ef4444', fontWeight: 'bold', marginTop: '2px' }}>
                            📌 علامة مميزة: {order.shippingAddress.distinctiveMark}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span>📍 نوع الاستلام:</span>
                      <strong style={{ color: '#0f766e', fontSize: '14px' }}>
                        {order.deliveryMethod?.shortName}
                      </strong>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>طريقة الدفع:</span>
                    <strong style={{ display: 'block', color: '#334155', fontSize: '13px' }}>
                      {order.paymentMethod === 0 ? '💵 كاش / عند الاستلام' : '💳 دفع إلكتروني'}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>إجمالي الحساب:</span>
                    <strong style={{ display: 'block', color: '#0f766e', fontSize: '18px' }}>
                      {(order.subTotal + (order.deliveryMethod?.cost || 0))} ج.م
                    </strong>
                  </div>
                </div>

                {activeStatus !== 5 && order.status !== 5 && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, order.status !== undefined ? order.status : activeStatus)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      borderRadius: '10px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      background: orderConfig.actionColor || '#0ea5e9',
                      color: 'white',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                      marginTop: '10px',
                      flexShrink: 0
                    }}
                  >
                    {orderConfig.actionLabel || 'تحديث الحالة 🔄'}
                  </button>
                )}

              </div>
            );
          })}

          {orders.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '15px', border: '2px dashed #cbd5e1' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📭</div>
              <h3 style={{ color: '#475569', margin: 0 }}>لا توجد طلبات في هذا القسم حالياً</h3>
            </div>
          )}
        </div>
      )}

    </div>
  );
}