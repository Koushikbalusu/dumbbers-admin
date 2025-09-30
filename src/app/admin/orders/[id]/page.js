"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminAPI } from "../../../../lib/api";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    
    const loadOrder = async () => {
      try {
        const data = await adminAPI.getOrder(orderId);
        setOrder(data.order);
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="card">
        <div>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="card">
        <div style={{ color: "#c62828" }}>
          {error || "Order not found"}
        </div>
        <Link href="/admin/orders" className="btn-primary" style={{ textDecoration: "none", marginTop: 16, display: "inline-block" }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const formatCurrency = (paise) => {
    return `₹${Math.round(paise / 100)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="grid gap-6">
      {/* Order Header */}
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 className="nav-title" style={{ marginBottom: 8 }}>Order Details</h1>
            <div style={{ fontFamily: 'DigitalCalculator', fontSize: 14, color: "#666" }}>
              Order ID: {order._id}
            </div>
          </div>
          <Link href="/admin/orders" className="btn-secondary" style={{ textDecoration: "none" }}>
            ← Back to Orders
          </Link>
        </div>

        <div className="grid grid-3" style={{ gap: 20 }}>
          <div className="form-group">
            <label>Status</label>
            <div style={{ 
              padding: "8px 12px", 
              background: order.status === 'paid' ? '#e8f5e8' : '#fff3cd', 
              border: `2px solid ${order.status === 'paid' ? '#4caf50' : '#ff9800'}`,
              borderRadius: "4px",
              textTransform: "uppercase",
              fontWeight: "bold"
            }}>
              {order.status}
            </div>
          </div>
          <div className="form-group">
            <label>Total Amount</label>
            <div className="digital" style={{ fontSize: 18, fontWeight: "bold" }}>
              {formatCurrency(order.amountPaise)}
            </div>
          </div>
          <div className="form-group">
            <label>Created</label>
            <div>{formatDate(order.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card">
        <div className="nav-title" style={{ marginBottom: 20 }}>Order Items</div>
        
        {order.items && order.items.length > 0 ? (
          <div className="grid gap-4">
            {order.items.map((item, index) => (
              <div key={index} className="card" style={{ padding: 16, background: "#f5f5f5" }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                      {item.name}
                    </div>
                    <div className="grid grid-2" style={{ gap: 12, fontSize: 14 }}>
                      <div>
                        <strong>Size:</strong> {item.size}
                      </div>
                      <div>
                        <strong>Color:</strong> {item.color}
                      </div>
                      <div>
                        <strong>Price per piece:</strong> {formatCurrency(item.price * 100)}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="digital" style={{ fontSize: 18, fontWeight: "bold" }}>
                      {formatCurrency(item.price * item.quantity * 100)}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      Total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
            No items found in this order
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="card">
        <div className="nav-title" style={{ marginBottom: 20 }}>Order Summary</div>
        <div className="grid grid-2" style={{ gap: 20 }}>
          <div>
            <h3 style={{ marginBottom: 12 }}>Shipping Address</h3>
            {order.shippingAddress ? (
              <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 4 }}>
                <div><strong>{order.shippingAddress.name}</strong></div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</div>
                <div>Phone: {order.shippingAddress.phone}</div>
              </div>
            ) : (
              <div style={{ color: "#666" }}>No shipping address</div>
            )}
          </div>
          <div>
            <h3 style={{ marginBottom: 12 }}>Payment Details</h3>
            <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 4 }}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotalPaise)}</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <span>Tax:</span>
                <span>{formatCurrency(order.taxPaise)}</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <span>Shipping:</span>
                <span>{formatCurrency(order.shippingPaise)}</span>
              </div>
              {order.discountPercent > 0 && (
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 8, color: "#4caf50" }}>
                  <span>Discount ({order.discountPercent}%):</span>
                  <span>-{formatCurrency(order.subtotalPaise * order.discountPercent / 100)}</span>
                </div>
              )}
              <div className="row" style={{ justifyContent: "space-between", borderTop: "2px solid #000", paddingTop: 8, fontWeight: "bold" }}>
                <span>Total:</span>
                <span className="digital">{formatCurrency(order.amountPaise)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
