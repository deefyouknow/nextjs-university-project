import { VscGraphLine } from "react-icons/vsc";
import { FaHome } from "react-icons/fa";
export const Sidebar = () => {
  return (
    <>
      <div className="bg-[#f7fafc] h-full flex flex-col w-69 pt-10.25 pl-9 pr-5">
        {/*Dashboard*/}
        <div className="flex w-full gap-5">
          <VscGraphLine className="text-3xl" />
          <h1 className="text-11 font-bold">Dashboard</h1>
        </div>        
        <div className="mt-7.5 w-full h-px bg-linear-to-r from-transparent via-black to-transparent"></div>
        {/*ส่วนของ Page*/}
        <div className="flex flex-col space-y-3 mt-3">
          {/*Dashboard*/}
          <div className="bg-white rounded-2xl flex items-center  px-4 py-[12px] w-[220px] h-[54px]">
            <div className="h-7.5 w-7.5 bg-[#4fd1c5] rounded-xl flex text-center justify-center items-center">
              <FaHome className="text-white"/>
            </div>
            <span className="text-[16px] font-bold pl-2">Dashboard</span>
          </div>
        </div>
      </div>
    </>
  )
}
