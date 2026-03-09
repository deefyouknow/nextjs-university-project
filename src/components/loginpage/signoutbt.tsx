// src/components/auth/LogoutButton.tsx
"use client";

import { useGlobal } from "@/components/globalvar/globalvariable"
import Link from "next/link";

interface LogoutButtonProps {
  variant?: "solid" | "outline" | "text";
  className?: string;
}

export const LogoutButton = ({ variant = "solid", className = "" }: LogoutButtonProps) => {
  const { logout, isLoggedIn } = useGlobal();

  return (
    <>
      {isLoggedIn ?
        <button
          onClick={logout}
          className="font-bold justify-center items-center flex gap-2 hover:bg-amber-300 bg-surface py-2 rounded-2xl px-3 border-text/10 border"
        >
          {/* ใส่ไอคอน Logout (ถ้ามี) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          SIGN OUT
        </button> :
        <Link
          href="/auth/login"
          className="font-bold justify-center items-center flex gap-2 hover:bg-amber-300 bg-surface py-2 rounded-2xl px-3 border-text/10 border"
        >
          {/* ใส่ไอคอน Logout (ถ้ามี) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          SIGN IN
        </Link>
      }
    </>
  );
};
