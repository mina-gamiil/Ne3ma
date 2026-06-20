import React, { useState, useEffect } from 'react';
import './OrdersTab.css';

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
    <div className="orders-tab-wrapper">
      
      <div className="orders-header-container">
        <h2 className="orders-main-title">إدارة الطلبات 🛒</h2>
        <p className="orders-subtitle">متابعة تفاصيل الوجبات وعناوين التوصيل لكل حالة</p>
      </div>

      <div className="orders-status-tabs-scroll">
        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
          const statusNum = parseInt(statusKey);
          const isActive = activeStatus === statusNum;
          return (
            <button
              key={statusNum}
              onClick={() => setActiveStatus(statusNum)}
              className={`status-tab-btn ${isActive ? 'active' : 'inactive'}`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="orders-loading-state">جاري تحميل الطلبات... ⏳</div>
      ) : (
        <div className="orders-grid-layout">
          {orders.map(order => {
            const orderConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG[activeStatus];
            
            return (
              <div key={order.id} className="order-card-modern" style={{ borderTop: `4px solid ${orderConfig.color}` }}>
                
                <div className="order-card-header">
                  <div>
                    <h3 className="order-id-heading">طلب #{order.id}</h3>
                    <small className="order-time-stamp">🕒 {formatOrderDate(order.orderDate)}</small>
                  </div>
                  <span className="order-status-badge" style={{ background: orderConfig.bg, color: orderConfig.color }}>
                    {orderConfig.label}
                  </span>
                </div>

                <div className="verification-code-box">
                  <span className="verif-label">🔑 كود التحقق:</span>
                  <span className="verif-code-val">{order.verificationCode}</span>
                </div>

                <div className="order-items-scroll-area">
                  <p className="order-items-title">📦 العناصر المطلوبة:</p>
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <img 
                        src={item.product?.pictureUrl || 'https://via.placeholder.com/40'} 
                        alt={item.product?.productName} 
                        className="order-item-img"
                      />
                      <div className="order-item-info-block">
                        <h4>{item.product?.productName}</h4>
                        <small>السعر: {item.price} ج.م</small>
                      </div>
                      <span className="order-item-qty-badge">
                        {item.quantity}✕
                      </span>
                    </div>
                  ))}
                </div>

                {order.shippingAddress ? (
                  <div className="address-details-block">
                    <div className="address-flex-row">
                      <span>👤 العميل:</span>
                      <strong className="address-bold-name">{order.shippingAddress.name}</strong>
                    </div>
                    <div className="address-flex-row">
                      <span>📞 الهاتف:</span>
                      <strong className="address-bold-name">{order.shippingAddress.phoneNumber}</strong>
                    </div>
                    <div className="address-flex-row" style={{ alignItems: 'flex-start' }}>
                      <span>📍 العنوان:</span>
                      <span style={{ color: '#1e293b', lineHeight: '1.4' }}>
                        {order.shippingAddress.displayName} 
                        {order.shippingAddress.distinctiveMark && (
                          <span className="distinctive-mark-alert">
                            📌 علامة مميزة: {order.shippingAddress.distinctiveMark}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="delivery-method-block">
                    <div className="delivery-method-row">
                      <span>📍 نوع الاستلام:</span>
                      <strong className="delivery-method-name">
                        {order.deliveryMethod?.shortName}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="order-footer-row">
                  <div>
                    <span className="payment-label-sub">طريقة الدفع:</span>
                    <strong className="payment-val-sub">
                      {order.paymentMethod === 0 ? '💵 كاش / عند الاستلام' : '💳 دفع إلكتروني'}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span className="total-label-sub">إجمالي الحساب:</span>
                    <strong className="total-val-sub">
                      {(order.subTotal + (order.deliveryMethod?.cost || 0))} ج.م
                    </strong>
                  </div>
                </div>

                {activeStatus !== 5 && order.status !== 5 && (
                  <button 
                    onClick={() => handleUpdateStatus(order.id, order.status !== undefined ? order.status : activeStatus)}
                    className="order-action-update-btn"
                    style={{ background: orderConfig.actionColor || '#0ea5e9', color: 'white' }}
                  >
                    {orderConfig.actionLabel || 'تحديث الحالة 🔄'}
                  </button>
                )}

              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="empty-orders-state">
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📭</div>
              <h3>لا توجد طلبات في هذا القسم حالياً</h3>
            </div>
          )}
        </div>
      )}

    </div>
  );
}