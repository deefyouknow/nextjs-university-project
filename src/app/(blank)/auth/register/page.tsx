'use client'
import Link from "next/link";
import { useState } from "react";

const RegisterPage = () => {
  const [userName, setuserName] = useState("");
  const [Password, setPassword] = useState("");
  const isFormComplete = userName && Password;
  
  return (
    <>
      <div className="flex min-h-dvh w-full items-center justify-center p-6 bg-surface sm:bg-bg">
        <div className="w-full max-w-100 min-w-80 bg-surface p-8 sm:rounded-3xl sm:shadow-xl sm:border border-muted/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-text mb-2">Get Started</h1>
            <p className="text-muted text-sm">สร้างบัญชีใหม่</p>
          </div>

          <form className="flex flex-col gap-5">
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
              <label className="text-sm font-bold pl-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <button
              className={`w-full py-4 font-bold rounded-2xl mt-4 transition-all active:scale-95 ${
                isFormComplete
                  ? "bg-primary text-bg hover:shadow-lg shadow-primary/20"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isFormComplete}
            >
              SIGN UP
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
