'use client'
import { FaHome } from "react-icons/fa";
import { useState } from 'react';
import { useEffect } from 'react';
import Link from "next/dist/client/link";
import { NavbarStyle } from '@/components/layout/navbar'
import { BottomStyle } from '@/components/layout/bottom'
import { BodyStyle } from '@/components/contents/firstpage/content'
import { Sidebar } from '@/components/layout/sidebar'

export interface AppProps {
  flexallcenter: string;
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const App = () => {
  const flexallcenter = 'flex items-center justify-center';
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className={`bg-gray-100 w-dvw h-dvh ${flexallcenter} flex-col relative overflow-x-hidden`}>
      <NavbarStyle flexallcenter={flexallcenter} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <BodyStyle flexallcenter={flexallcenter} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Sidebar  openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <BottomStyle />
    </div>
  )
}

export default App;

const test01 = () => {
  return (
    <div>
      <div className="">
        
      </div>
    </div>
  )
}
