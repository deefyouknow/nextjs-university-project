'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useMemo } from 'react';
import { useEffect } from 'react';

interface GlobalContextType {
  var1: boolean;
  setVar1: Dispatch<SetStateAction<boolean>>;
  sidebarSwitch: boolean;
  setSidebarSwitch: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined); // ไม่ต้องแก้ไข

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [var1, setVar1] = useState(true);
  const [sidebarSwitch, setSidebarSwitch] = useState(false);


  const contextValue = useMemo(() => ({
    var1,
    setVar1,
    sidebarSwitch,
    setSidebarSwitch,
  }), [var1, sidebarSwitch]); // ใน [ ตรงนี้ใส่สิ่งที่ค่าไม่คงที่หรือเปลี่ยนแปลง ] 

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
