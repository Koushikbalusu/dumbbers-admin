"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "../../../lib/api";

export default function OrdersPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({ status: "", user: "", from: "", to: "" });
  const [loading, setLoading] = useState(false);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await adminAPI.listOrders({ page: p, limit, ...filters });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || p);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [limit]);

  return (
    <div className="grid gap-6">
      <div className="form-section">
        <div className="nav-title" style={{ marginBottom: 20 }}>Filter Orders</div>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
              <option value="">All</option>
              {['created','payment_pending','paid','fulfilled','cancelled','refund_pending','refunded','failed'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>User ID</label>
            <input value={filters.user} onChange={e => setFilters(f => ({ ...f, user: e.target.value }))} placeholder="user objectId" />
          </div>
          <div className="form-group">
            <label>From Date</label>
            <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
          </div>
          <div className="form-group" style={{ alignSelf: "end" }}>
            <button onClick={() => load(1)} disabled={loading} className="btn-primary">Apply Filters</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <span className="badge">{total}</span> Orders
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <label>Per page</label>
            <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
              {[10,20,50].map(n => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Amount (₹)</th>
                <th>Items</th>
                <th>Razorpay</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr 
                  key={o._id} 
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/admin/orders/${o._id}`)}
                  onMouseEnter={(e) => e.target.style.background = "#e0e0e0"}
                  onMouseLeave={(e) => e.target.style.background = ""}
                >
                  <td style={{ fontFamily: 'DigitalCalculator' }}>{o._id}</td>
                  <td>{o.status}</td>
                  <td className="digital">{Math.round((o.amountPaise||0)/100)}</td>
                  <td>{o.items?.reduce((a,b)=>a+(b.quantity||0),0)}</td>
                  <td>{o.razorpayPaymentId ? 'Paid' : '-'}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={6}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-controls">
            <button 
              className="btn-secondary" 
              onClick={() => { if (page>1) load(page-1); }}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => { if (page<pages) load(page+1); }}
              disabled={page >= pages}
            >
              Next
            </button>
          </div>
          <div className="pagination-info">Page {page} / {pages}</div>
        </div>
      </div>
    </div>
  );
}


