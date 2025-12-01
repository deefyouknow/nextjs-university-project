import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { AppProps } from '@/app/page';

export const NavbarStyle: React.FC<AppProps> = ({ flexallcenter,openSidebar,setOpenSidebar }) => {
  return (
    <nav className={`bg-white/80 flex backdrop-blur-2xl ${flexallcenter} h-16 p-2 top-0 shadow absolute w-full z-50`}>
      <div className={`flex justify-between w-full items-center max-w-7xl overflow-x-hidden px-6`}>
        <button className={`bg-gray-200 rounded-full p-3 flex justify-center items-center hover:bg-gray-400 active:bg-gray-600 duration-300`}
          onClick={() => setOpenSidebar(!openSidebar)}
        ><FaBars className="text-black scale-155" /></button>
        <ul className={`text-black flex space-x-4 h-full justify-center items-center`}>
          <li className="text-center">สวัสดี</li>
          <a href='/login' className='bg-amber-300 p-2 rounded-sm hover:bg-amber-500 active:bg-amber-400 duration-300'>Login</a>
        </ul>
      </div>
    </nav>
  )
}
