"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { email: form.email, password: form.password },
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/admin");
      } else {
        setError("Login failed - no token received");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "var(--background)",
      padding: "20px"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="nav-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
            DUMBBERS ADMIN
          </div>
          <p>Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="form-group">
            <label className="required">Admin Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="required">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ 
              background: "#ffebee", 
              color: "#c62828", 
              padding: "12px", 
              borderRadius: "4px",
              border: "1px solid #ffcdd2"
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "#f5f5f5", 
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666"
        }}>
          <strong>Note:</strong> This is an admin-only login. Contact your system administrator for credentials.
        </div>
      </div>
    </div>
  );
}
