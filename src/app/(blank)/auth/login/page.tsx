"use client";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/components/globalvar/globalvariable";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // สำหรับเก็บข้อความแจ้งเตือน
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useGlobal();

  // ตรวจสอบความครบถ้วนเบื้องต้นเพื่อให้ปุ่มกดได้
  const isFormComplete = username && password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // ล้าง error เก่าก่อนเริ่มตรวจสอบใหม่

    // --- Validation Logic ---
    if (username.length < 4) {
      setError("Username ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (password.length < 6) {
      setError("Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    // ------------------------

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // ✅ เก็บ Token ลงใน Cookie (อยู่ได้ 1 วัน หรือตามต้องการ)
        Cookies.set("token", data.token, { expires: 1, path: "/" });
        setIsLoggedIn(true);

        // ไปหน้า Dashboard หรือหน้าหลัก
        router.push("/dashboard");
        router.refresh(); // เพื่อให้ Server Components รับรู้ถึง Cookie ใหม่
      } else {
        setError(data.message || "Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (_err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      console.log(_err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-dvh w-full items-center justify-center p-6 bg-surface sm:bg-bg">
        <div className="w-full max-w-100 min-w-80 bg-surface p-8 rounded-3xl sm:shadow-xl sm:border border-muted/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
            <p className="text-muted text-sm">กรุณาเข้าสู่ระบบ</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Username</label>
              <input
                type="text"
                placeholder="username"
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ส่วนแสดง Error Message (จะโชว์เมื่อมี error เท่านั้น) */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs animate-in fade-in zoom-in duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-4 font-bold rounded-2xl mt-4 transition-all active:scale-95 ${
                isFormComplete && !loading
                  ? "bg-primary text-bg hover:shadow-lg shadow-primary/20"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isFormComplete || loading}
            >
              {loading ? "กำลังตรวจสอบ..." : "SIGN IN"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-muted">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-bold hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
          <Link href="/" className="text-muted text-center w-full">
            <p className="text-center pt-2">กลับไปหน้าหลัก</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;