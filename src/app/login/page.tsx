"use client"; // บรรทัดนี้สำคัญมากสำหรับ App Router
import { useEffect, useState } from 'react';

// 1. เปลี่ยน import ตรงนี้ครับ: เอา GoogleLoginResponse ออก ใส่ CredentialResponse แทน
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Mail, Home, Search, Bell, Menu, Camera, Lock, ArrowRight } from 'lucide-react';

const Googleloginbutton = () => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google ให้ Token มาแล้ว:", credentialResponse.credential);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential, // ส่ง token ไป
        }),
      });
      const data = await res.json();
      console.log("ผลจาก Server:", data);
      if (res.ok) {  
        alert("ล็อกอินสำเร็จ! สวัสดีคุณ " + data.email);   
      }
    } catch (error) {
      console.error("ส่งไป Server ไม่ได้:", error);
    }
  };

  return (
    // ⚠️ เอา Client ID ที่เพิ่งได้มา ใส่ตรงนี้ครับ
    <GoogleOAuthProvider clientId="628938408759-nuif11c3jo65jc3qcpp1arb1opfarshs.apps.googleusercontent.com">
      <div className='flex'>
        <div>            
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Failed')}
            />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

const BodyLogin = () => {
  return (
    <div className='w-[100dvw] h-[100dvh] flex justify-center'>
      <LoginPage />
    </div>
  )
}

const LoginPage = () => {
  // 1. สร้างตัวแปร (State) สำหรับเก็บค่าจากฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // ฟังก์ชันสำหรับอัปเดตค่าเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. ตรวจสอบว่ามีค่าว่างหรือไม่ (ถ้าว่าง ค่าจะเป็น false)
  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  // 3. ฟังก์ชันเมื่อกดปุ่ม Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    
    if (isFormValid) {
      // --- พื้นที่สำหรับนำค่าไปใช้งานต่อ ---
      console.log("ส่งข้อมูลสำเร็จ:", formData);
      alert(`Login ด้วย Email: ${formData.email}`);
      // คุณสามารถเขียนโค้ดเรียก API ตรงนี้ได้เลย
      // -----------------------------------
    }
  };

  // สไตล์พื้นฐาน
  const inputContainerStyle = `flex items-center mt-4`;
  const inputStyle = `w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200`;
  const iconStyle = `w-5 h-5 text-gray-400 absolute left-3`;

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl h-[600px] flex rounded-2xl shadow-2xl overflow-hidden">
        
        {/* ส่วนรูปภาพ (ซ้าย) */}
        <div className="hidden md:flex w-1/2 bg-amber-500 flex-col justify-center items-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center text-amber-100">
            ลงชื่อเข้าใช้เพื่อเข้าถึงบัญชีของคุณและจัดการงานต่างๆ ได้อย่างรวดเร็ว
          </p>
        </div>

        {/* ส่วนฟอร์ม (ขวา) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Log In</h1>
            <p className="text-gray-500 mt-2">Please enter your details.</p>
          </div>

          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className={inputContainerStyle}>
              <Mail className={iconStyle} />
              <input 
                type="email" 
                name="email" // จำเป็นต้องมี name ให้ตรงกับ key ใน state
                value={formData.email} // ผูกค่ากับ State
                onChange={handleChange} // อัปเดตค่าเมื่อพิมพ์
                placeholder="Email Address" 
                className={inputStyle} 
              />
            </div>

            {/* Password Field */}
            <div className={inputContainerStyle}>
              <Lock className={iconStyle} />
              <input 
                type="password" 
                name="password" // จำเป็นต้องมี name ให้ตรงกับ key ใน state
                value={formData.password} // ผูกค่ากับ State
                onChange={handleChange} // อัปเดตค่าเมื่อพิมพ์
                placeholder="Password" 
                className={inputStyle} 
              />
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-amber-500" />
                Remember me
              </label>
              <a href="#" className="text-amber-600 hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button 
              type="submit"
              disabled={!isFormValid} // ล็อคปุ่มถ้าฟอร์มไม่สมบูรณ์
              className={`mt-8 font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2 shadow-lg 
                ${isFormValid 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed' // สไตล์เมื่อกดไม่ได้
                }`}
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="signup" className="text-amber-600 font-bold hover:underline">
              Sign up
            </a>
          </div>
          
          {/* Google Login Button */}
          <div className={`flex w-full justify-center mt-4`}>
             <Googleloginbutton />
          </div>
          <div className="mt-8 text-center text-sm text-gray-600">
            Want to go back to the homepage?{' '}
            <a href="./" className="text-amber-600 font-bold hover:underline">
              Go back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyLogin;
