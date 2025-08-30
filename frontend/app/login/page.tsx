"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "100dvh",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Connector Login</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Enter your <b>e-mail</b> and <b>password</b>.
        </p>

        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@uni.edu.au"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Passcode
        </label>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Your password"
          required
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              color: "#991B1B",
              padding: "10px 12px",
              borderRadius: 10,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #111827",
            fontSize: 16,
            fontWeight: 700,
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 14 }}>
          Having trouble? Double-check your e-mail and password. Contact the
          organizer if needed.
        </p>
      </form>
    </main>
  );
}
