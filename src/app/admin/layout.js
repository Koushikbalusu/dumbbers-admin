"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminGate from "./modules/AdminGate";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link href="/admin" className="nav-title" style={{ textDecoration: "none" }}>
            DUMBBERS ADMIN
          </Link>
          <div className="nav-spacer" />
          <div className="nav-right">
            <Link href="/admin" className="nav-link">Dashboard</Link>
            <Link href="/admin/orders" className="nav-link">Orders</Link>
            <Link href="/admin/products" className="nav-link">Products</Link>
            <button onClick={handleLogout} className="nav-link" style={{ background: "#c4c4c4" }}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container" style={{ paddingTop: 16, paddingBottom: 40 }}>
        <AdminGate>
          {children}
        </AdminGate>
      </main>
    </div>
  );
}


