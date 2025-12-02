"use client";
import { useEffect, useState, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'; // เพิ่ม Loader2

// Component ปุ่ม Google Login แยกออกมา
const GoogleLoginSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // ใช้ useRef เพื่อเก็บ Timeout ID จะได้ clear ได้เมื่อ unmount
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google ให้ Token มาแล้ว:", credentialResponse.credential);
    
    // 1. เริ่มโหลด
    setIsLoading(true);

    // 2. ตั้งเวลา 20 วินาที ถ้าเกินให้หยุดโหลดและแจ้งเตือน
    timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        alert("การเชื่อมต่อหมดเวลา (Timeout) กรุณาลองใหม่อีกครั้ง");
    }, 20000); // 20000 ms = 20 วินาที

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      // ถ้าได้ Response กลับมา ให้เคลียร์ timeout ทันที
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const data = await res.json();
      console.log("ผลจาก Server:", data);

      if (res.ok) {  
        alert("ล็อกอินสำเร็จ! สวัสดีคุณ " + data.email);   
        // Redirect หรือทำอย่างอื่นต่อ
      } else {
        alert("Login ไม่สำเร็จ: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      console.error("ส่งไป Server ไม่ได้:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
    } finally {
      // 3. หยุดโหลดไม่ว่าจะสำเร็จหรือล้มเหลว
      setIsLoading(false);
    }
  };

  // Cleanup timeout เมื่อ component ถูกทำลาย
  useEffect(() => {
    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="628938408759-nuif11c3jo65jc3qcpp1arb1opfarshs.apps.googleusercontent.com">
      <div className='flex w-full justify-center mt-4'>
        {isLoading ? (
            // แสดง Spinner ตอนโหลด
            <div className="flex items-center gap-2 text-amber-600 font-semibold py-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
            </div>
        ) : (
            // แสดงปุ่ม Google Login ปกติ
            <div>              
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => console.log('Login Failed')}
                    shape="pill" // ปรับแต่งปุ่มได้ตามต้องการ
                />
            </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

const BodyLogin = () => {
  return (
    // ใช้ 100dvh และ 100dvw เพื่อให้เต็มจอ Safari/Mobile โดยไม่มี scrollbar
    <div className='w-[100dvw] h-[100dvh] bg-gray-100 flex justify-center items-center overflow-hidden'>
      <LoginPage />
    </div>
  )
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (isFormValid) {
      console.log("ส่งข้อมูลสำเร็จ:", formData);
      alert(`Login ด้วย Email: ${formData.email}`);
    }
  };

  const inputContainerStyle = `relative flex items-center mt-4`;
  const inputStyle = `w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-200`;
  const iconStyle = `w-5 h-5 text-gray-400 absolute left-3`;

  return (
      // ปรับ Container ให้เป็น max-h-[95dvh] เพื่อไม่ให้ล้นจอ
      <div className="bg-white w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden h-auto max-h-[95dvh] m-4">
        
        {/* ส่วนรูปภาพ (ซ้าย) */}
        <div className="hidden md:flex w-1/2 bg-amber-500 flex-col justify-center items-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center text-amber-100">
            ลงชื่อเข้าใช้เพื่อเข้าถึงบัญชีของคุณและจัดการงานต่างๆ ได้อย่างรวดเร็ว
          </p>
        </div>

        {/* ส่วนฟอร์ม (ขวา) - เพิ่ม overflow-y-auto */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 overflow-y-auto">
          
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
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address" 
                className={inputStyle} 
              />
            </div>

            {/* Password Field */}
            <div className={inputContainerStyle}>
              <Lock className={iconStyle} />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
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
              disabled={!isFormValid} 
              className={`mt-8 font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2 shadow-lg 
                ${isFormValid 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed' 
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
          
          {/* เรียกใช้ Google Login Section ที่แยกออกมา */}
          <GoogleLoginSection />

          <div className="mt-8 text-center text-sm text-gray-600">
            Want to go back to the homepage?{' '}
            <a href="./" className="text-amber-600 font-bold hover:underline">
              Go back to home
            </a>
          </div>
        </div>
      </div>
  );
};

export default BodyLogin;
