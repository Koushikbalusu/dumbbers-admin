"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://dumbbers-backend.onrender.com";

export async function apiRequest(path, { method = "GET", body, token, headers = {}, nextOptions = {} } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : undefined);
  if (authToken) finalHeaders.Authorization = `Bearer ${authToken}`;

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    ...nextOptions,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    const message = data?.message || res.statusText || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data?.data ?? data;
}

export const adminAPI = {
  listOrders: (params) => apiRequest(`/api/admin/orders${toQuery(params)}`),
  getOrder: (id) => apiRequest(`/api/admin/orders/${id}`),
  listProducts: (params) => apiRequest(`/api/admin/products${toQuery(params)}`),
  getProduct: (id) => apiRequest(`/api/admin/products/${id}`),
  createProduct: (payload) => apiRequest(`/api/admin/products`, { method: "POST", body: payload }),
  updateProduct: (id, payload) => apiRequest(`/api/admin/products/${id}`, { method: "PUT", body: payload }),
  deleteProduct: (id) => apiRequest(`/api/admin/products/${id}`, { method: "DELETE" }),
};

function toQuery(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (!entries.length) return "";
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return `?${qs}`;
}


