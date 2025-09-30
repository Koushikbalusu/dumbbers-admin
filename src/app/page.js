"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div className="card">
        <div style={{ textAlign: "center" }}>
          <div className="nav-title" style={{ marginBottom: 12 }}>DUMBBERS ADMIN</div>
          <p>Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
