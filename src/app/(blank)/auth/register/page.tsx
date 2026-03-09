'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter(); 
  const [userName, setuserName] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // แยกตัวแปรตัวที่สอง
  const [error, setError] = useState(""); // สำหรับเก็บข้อความแจ้งเตือน
  const [loading, setLoading] = useState(false);

  // ตรวจสอบความครบถ้วนเบื้องต้นเพื่อให้ปุ่มกดได้
  const isFormComplete = userName && Password && confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // ล้าง error เก่าก่อนเริ่มตรวจสอบใหม่

    // --- Validation Logic ---
    if (userName.length < 4) {
      setError("ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (Password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (Password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    // ------------------------

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: Password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("ลงทะเบียนสำเร็จ!");
        router.push('/auth/login');
        console.log(result.serverResponse);
      } else {
        setError(result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
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
        <div className="w-full max-w-100 min-w-80 bg-surface p-8 sm:rounded-3xl sm:shadow-xl sm:border border-muted/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-text mb-2">Get Started</h1>
            <p className="text-muted text-sm">สร้างบัญชีใหม่</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Full Name</label>
              <input
                type="text"
                placeholder="name"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword} // ใช้ตัวแปรใหม่
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* ส่วนแสดง Error Message ที่คุณต้องการ (จะโชว์เมื่อมี error เท่านั้น) */}
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
              {loading ? "SENDING..." : "SIGN UP"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-muted">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
