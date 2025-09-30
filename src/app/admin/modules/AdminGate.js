"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";

export default function AdminGate({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Check if token exists first
        const token = localStorage.getItem("token");
        if (!token) {
          if (mounted) {
            router.push("/login");
            return;
          }
        }

        // quick call to profile to ensure token is present and role
        const data = await apiRequest("/api/auth/profile");
        if (mounted && data?.user?.role === "admin") {
          setStatus("ok");
        } else if (mounted) {
          // Clear invalid token and redirect to login
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (e) {
        if (mounted) {
          // Clear invalid token and redirect to login
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  if (status === "loading") {
    return <div className="card">Checking admin access…</div>;
  }
  
  return children;
}


