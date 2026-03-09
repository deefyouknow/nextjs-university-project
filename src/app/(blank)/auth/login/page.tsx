"use client"
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie"; // ติดตั้งด้วย: npm install js-cookie
import { useRouter } from "next/navigation";
import { useGlobal } from "@/components/globalvar/globalvariable";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setIsLoggedIn } = useGlobal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (username.length < 4) {
      alert("Username ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      alert("Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ เก็บ Token ลงใน Cookie (อยู่ได้ 1 วัน หรือตามต้องการ)
        Cookies.set("token", data.token, { expires: 1, path: '/' });
        setIsLoggedIn(true);

        alert("เข้าสู่ระบบสำเร็จ!");
        // ไปหน้า Dashboard หรือหน้าหลัก
        router.push("/dashboard");
        router.refresh(); // เพื่อให้ Server Components รับรู้ถึง Cookie ใหม่
      } else {
        alert("Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
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
                type="username"
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

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-bg font-bold rounded-2xl mt-4 hover:shadow-lg shadow-primary/20 transition-all active:scale-95">
              {loading ? "กำลังตรวจสอบ..." : "SIGN IN"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-muted">
            ยังไม่มีบัญชีใช่ไหม? <Link href="/auth/register" className="text-primary font-bold hover:underline">สมัครสมาชิก</Link>
          </p>
          <Link href="/" className="text-muted text-center w-full">
            <p className="text-center pt-2">กลับไปหน้าหลัก</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
