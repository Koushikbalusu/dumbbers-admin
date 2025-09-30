"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminAPI } from "../../../lib/api";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({ q: "", category: "", gender: "", brand: "", isActive: "" });
  const [loading, setLoading] = useState(false);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await adminAPI.listProducts({ page: p, limit, ...filters });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || p);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [limit]);

  const onDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await adminAPI.deleteProduct(id);
      await load(page);
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="form-section">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="nav-title">Filter Products</div>
          <Link href="/admin/products/new" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">New Product</button>
          </Link>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Search</label>
            <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="name/brand/tags" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} placeholder="e.g. PANTS" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <input value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} placeholder="MEN/WOMEN/UNISEX" />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={filters.isActive} onChange={e => setFilters(f => ({ ...f, isActive: e.target.value }))}>
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="form-group" style={{ alignSelf: "end" }}>
            <button onClick={() => load(1)} disabled={loading} className="btn-primary">Apply Filters</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div><span className="badge">{total}</span> Products</div>
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
                <th>Name</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Variants</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.gender}</td>
                  <td>{p.variants?.length || 0}</td>
                  <td>{p.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/products/${p._id}`} className="btn-secondary" style={{ textDecoration: 'none' }}>
                        Edit
                      </Link>
                      <button onClick={() => onDelete(p._id)} className="btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={6}>No products</td></tr>
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


