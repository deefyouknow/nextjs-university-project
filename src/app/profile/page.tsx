'use client'
import Link from "next/link";
import { FaLock } from "react-icons/fa";

const Profile = () => {
  return (
    <>
      <div className="h-full w-full flex items-start justify-center p-5">
        {/*zone page*/}
        <div className="rounded-md border-muted/10 border-2 shadow-2xs bg-surface flex flex-col items-center p-10 max-w-md w-full min-w-60">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FaLock className="text-primary text-2xl" />
          </div>
          {/*Accesc Denied*/}
          <p className="text-text pb-2 pt-6 text-2xl font-bold whitespace-nowrap">Access Denied</p>
          {/*text*/}
          <p className="text-center text-text pb-8 whitespace-nowrap">
            กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์ <br /> 
            และจัดการระบบ
          </p>
          {/*Link to Login*/}
          <Link href="/" className="bg-primary py-3 px-5 rounded-2xl w-full min-w-25 flex justify-center text-nowrap">
            Go to Login
          </Link>
          <Link href="/" className="text-muted pt-4 text-nowrap">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  )
}

export default Profile;
