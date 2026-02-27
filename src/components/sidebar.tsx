'use client'
import { VscGraphLine } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";

import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useGlobal } from "@/components/globalvar/globalvariable";

export const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { sidebarSwitch } = useGlobal();
  return (
    <>
      <div className={`bg-bg hidden md:block overflow-x-visible w-69 pt-10.25 pl-9 pr-5'} h-full flex flex-col`}>
        {/*Dashboard*/}
        <div className="flex w-full gap-5">
          <VscGraphLine className="text-3xl" />
          <h1 className={`text-11 font-bold pt-2`}>Dashboard</h1>
        </div>        
        <div className="mt-7.5 w-full h-px bg-linear-to-r from-transparent via-text to-transparent"></div>
        {/*ส่วนของ Page*/}
        <div className={`flex flex-col space-y-3 mt-3`}>
          {/*Dashboard*/}
          <Link href="/" className={`${isActive('/') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <FaHome className="text-bg"/>
            </div>
            <span className="text-[16px] font-bold pl-2">Dashboard</span>
          </Link>
          {/*Tables*/}
          <Link href="/tables" className={`${isActive('/tables') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <IoStatsChart className="text-bg"/>
            </div>
            <span className="text-[16px] font-bold pl-2">Tables</span>
          </Link>
          {/*User Page*/}
          <h1 className="font-bold pl-4 py-3">ACCOUNT PAGES</h1>
          <Link href="/profile" className={`${isActive('/profile') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <FaUser className="text-bg"/>
            </div>
            <span className="text-[16px] font-bold pl-2">Profile</span>
          </Link>
        </div>
      </div>
    </>
  )
}
