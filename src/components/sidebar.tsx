import { VscGraphLine } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
export const Sidebar = () => {
  return (
    <>
      <div className="bg-gray-100 h-full flex flex-col w-69 pt-10.25 pl-9 pr-5">
        {/*Dashboard*/}
        <div className="flex w-full gap-5">
          <VscGraphLine className="text-3xl" />
          <h1 className="text-11 font-bold">Dashboard</h1>
        </div>        
        <div className="mt-7.5 w-full h-px bg-linear-to-r from-transparent via-black to-transparent"></div>
        {/*ส่วนของ Page*/}
        <div className="flex flex-col space-y-3 mt-3">
          {/*Dashboard*/}
          <div className="bg-amber-300 rounded-2xl flex items-center  px-4 py-[12px] w-[220px] h-[54px]">
            <FaHome />
            <span>Dashboard</span>
          </div>
        </div>
      </div>
    </>
  )
}
