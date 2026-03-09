'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface GlobalContextType {
  var1: boolean;
  setVar1: Dispatch<SetStateAction<boolean>>;
  sidebarSwitch: boolean;
  setSidebarSwitch: Dispatch<SetStateAction<boolean>>;
  // --- ส่วนที่เพิ่มใหม่สำหรับ Auth ---
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>; // 👈 เพิ่มตัวนี้เข้าไป
  logout: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined); // ไม่ต้องแก้ไข

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [var1, setVar1] = useState(true);
  const [sidebarSwitch, setSidebarSwitch] = useState(false);

  // 🟢 เพิ่มสถานะ Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  // 🔎 เช็ค Token ทุกครั้งที่เปิดหน้าเว็บ
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🚀 ฟังก์ชัน Logout กลาง
  const logout = () => {
    Cookies.remove("token", { path: '/' });
    setIsLoggedIn(false);
    router.push("/auth/login");
    
    Cookies.remove("access_token", { path: '/' });
    // ลบ Local Storage 
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.refresh();
    window.location.href = "/";
  };

  const contextValue = useMemo(() => ({
    var1,
    setVar1,
    sidebarSwitch,
    setSidebarSwitch,
    // ส่วน login logout
    setIsLoggedIn,
    isLoggedIn,
    logout,
  }), [var1, sidebarSwitch, isLoggedIn]); // ใน [ ตรงนี้ใส่สิ่งที่ค่าไม่คงที่หรือเปลี่ยนแปลง ] 

  // ส่วนนี้ไม่ต้องแก้ไข
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

// ส่วนนี้ไม่ต้องแก้ไข
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('<GlobalProvider>');
  }
  return context;
};
