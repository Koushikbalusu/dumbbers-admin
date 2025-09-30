"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminAPI } from "../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ usersCount: 0, productsCount: 0, ordersCount: 0, totalRevenuePaise: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminAPI.listOrders({ limit: 1 });
        const productData = await adminAPI.listProducts({ limit: 1 });
        setStats({
          usersCount: 0, // Would need a separate API call
          productsCount: productData.total || 0,
          ordersCount: data.total || 0,
          totalRevenuePaise: 0, // Would need stats API
        });
      } catch (e) {
        console.error("Failed to load stats:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="nav-title" style={{ marginBottom: 16 }}>Admin Dashboard</div>
        <div className="grid grid-4" style={{ gap: 16 }}>
          <div className="card">
            <div className="digital" style={{ fontSize: "24px", fontWeight: "bold" }}>
              {stats.ordersCount}
            </div>
            <div>Total Orders</div>
          </div>
          <div className="card">
            <div className="digital" style={{ fontSize: "24px", fontWeight: "bold" }}>
              {stats.productsCount}
            </div>
            <div>Products</div>
          </div>
          <div className="card">
            <div className="digital" style={{ fontSize: "24px", fontWeight: "bold" }}>
              {stats.usersCount}
            </div>
            <div>Users</div>
          </div>
          <div className="card">
            <div className="digital" style={{ fontSize: "24px", fontWeight: "bold" }}>
              ₹{Math.round(stats.totalRevenuePaise / 100)}
            </div>
            <div>Revenue</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 16 }}>
        <Link href="/admin/orders" style={{ textDecoration: "none" }}>
          <div className="card" style={{ cursor: "pointer", textAlign: "center" }}>
            <div className="nav-title" style={{ marginBottom: 8 }}>Orders</div>
            <p>Manage customer orders, payments, and fulfillment</p>
          </div>
        </Link>
        <Link href="/admin/products" style={{ textDecoration: "none" }}>
          <div className="card" style={{ cursor: "pointer", textAlign: "center" }}>
            <div className="nav-title" style={{ marginBottom: 8 }}>Products</div>
            <p>Add, edit, and manage product catalog</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
