'use client'
import { usePathname } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle"
import { AiOutlineAlignRight } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useGlobal } from "@/components/globalvar/globalvariable";

export const Header = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { setSidebarSwitch, sidebarSwitch } = useGlobal();
  return (
    <>
      <div className='flex flex-row justify-between pl-5 pr-3 md:pr-10'>
        <div className='h-25.25 w-full bg-bg flex flex-col justify-center'>
          <div className='flex flex-col text-[15px] font-bold'>
            <h1 className='text-muted hidden md:block'>
              path{" "}/
              <span className='text-text'>
                {" "}
                {isActive('/') ? 'Dashboard' : pathname.replace('/', '')}</span>
            </h1>
            <h1>{isActive('/') ? 'Dashboard' : pathname.replace('/', '')}</h1>
          </div>
        </div>
        {/*right 0*/}
        <div className='flex flex-row h-full w-full items-center justify-end space-x-2'>
          <CgProfile />
          <IoSettingsSharp />
          {/*{sidebarSwitch.toString()}*/}
          {/*Toggle Open Sidebar*/}
          <button onClick={() => setSidebarSwitch(!sidebarSwitch)}
            className="bg-surface text-text font-bold  h-10 w-10 md:hidden flex items-center justify-center rounded-xl border-text/20 border-1">
            <AiOutlineAlignRight />
          </button>
          <div className='hidden md:block'>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
