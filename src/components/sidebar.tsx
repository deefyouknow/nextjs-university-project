'use client'
import { VscGraphLine } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";

import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useGlobal } from "@/components/globalvar/globalvariable";
import { useEffect } from "react";

export const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <>
      <div className={`bg-bg hidden md:block overflow-x-visible w-69 pt-10.25 pl-9 pr-5 h-full flex flex-col`}>
        {/*Dashboard*/}
        <Link href={"/"}>
          <div className="flex w-full gap-5 pl-4">
            <VscGraphLine className="text-3xl" />
            <h1 className={`text-11 font-bold pt-2`}>Dashboard</h1>
          </div>
        </Link>
        <div className="mt-7.5 w-full h-px bg-linear-to-r from-transparent via-text to-transparent"></div>
        {/*ส่วนของ Page*/}
        <div className={`flex flex-col space-y-3 mt-3`}>
          {/*Dashboard*/}
          <Link href="/" className={`${isActive('/') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <FaHome className="text-bg" />
            </div>
            <span className="text-[16px] font-bold pl-2">Dashboard</span>
          </Link>
          {/*Tables*/}
          <Link href="/tables" className={`${isActive('/tables') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <IoStatsChart className="text-bg" />
            </div>
            <span className="text-[16px] font-bold pl-2">Tables</span>
          </Link>
          {/*User Page*/}
          <h1 className="font-bold pl-4 py-3">ACCOUNT PAGES</h1>
          <Link href="/profile" className={`${isActive('/profile') ? 'bg-surface' : ''} rounded-2xl flex items-center  px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
            <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
              <FaUser className="text-bg" />
            </div>
            <span className="text-[16px] font-bold pl-2">Profile</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export const SidebarMobile = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { sidebarSwitch, setSidebarSwitch } = useGlobal();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarSwitch(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarSwitch]);

  return (
    <>
      <div className={`
        fixed inset-0 z-999 md:hidden flex overflow-x-visible overflow-y-hidden 
        ${sidebarSwitch ? 'visible' : 'invisible'}
      `}>

        <button 
          onClick={() => setSidebarSwitch(false)} 
          className={`
            absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out
            ${sidebarSwitch ? 'opacity-100' : 'opacity-0'}
          `}
        />

        <div className={`
          relative h-full w-80 transition-transform duration-0 ease-out
          ${sidebarSwitch ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full w-full p-5">
            <div className="bg-surface h-full w-full p-2 rounded-2xl shadow-2xl">              

              <Link href={"/"}>
                <div className="flex w-full gap-5 pl-4 pt-8">
                  <VscGraphLine className="text-3xl" />
                  <h1 className={`text-11 font-bold pt-2`}>Dashboard</h1>
                </div>
              </Link>

              <div className="mt-7.5 w-full h-px bg-linear-to-r from-transparent via-text to-transparent"></div>

              <div className={`flex flex-col space-y-3 mt-3`}>
                <Link href="/" className={`${isActive('/') ? 'bg-surface' : ''} rounded-2xl flex items-center px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
                  <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
                    <FaHome className="text-bg" />
                  </div>
                  <span className="text-[16px] font-bold pl-2">Dashboard</span>
                </Link>

                <Link href="/tables" className={`${isActive('/tables') ? 'bg-surface' : ''} rounded-2xl flex items-center px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
                  <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
                    <IoStatsChart className="text-bg" />
                  </div>
                  <span className="text-[16px] font-bold pl-2">Tables</span>
                </Link>

                <h1 className="font-bold pl-4 py-3 uppercase text-xs text-muted">Account Pages</h1>

                <Link href="/profile" className={`${isActive('/profile') ? 'bg-surface' : ''} rounded-2xl flex items-center px-4 py-3 w-55 h-13.5 hover:bg-muted duration-150 active:bg-primary`}>
                  <div className="h-7.5 w-7.5 bg-primary rounded-xl flex text-center justify-center items-center">
                    <FaUser className="text-bg" />
                  </div>
                  <span className="text-[16px] font-bold pl-2">Profile</span>
                </Link>
                <div className="absolute bottom-0 pb-11 pl-4">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
