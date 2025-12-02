"use client"
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle, Phone, AlertCircle } from 'lucide-react';

const SignUpPage = () => {
  // 1. State ข้อมูล
  const [formData, setFormData] = useState({
    f: '', e: '', p: '', pw: '', confirmPw: '', agreeTerm: false
  });

  // 2. State เช็คว่า User เคยคลิกช่องนั้นหรือยัง (Touched State)
  const [touched, setTouched] = useState({
    f: false, e: false, p: false, pw: false, confirmPw: false
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Logic ตรวจสอบความถูกต้อง (Validation)
  const isFullnameValid = formData.f.length >= 3;
  const isEmailValid = emailRegex.test(formData.e);
  const isPhoneValid = /^\d+$/.test(formData.p) && formData.p.length >= 8 && formData.p.length <= 10;
  const isPasswordValid = formData.pw.length >= 8;
  const isPasswordMatch = formData.pw === formData.confirmPw && formData.pw !== '';
  const isTermChecked = formData.agreeTerm;

  const isFormValid = isFullnameValid && isEmailValid && isPhoneValid && isPasswordValid && isPasswordMatch && isTermChecked;

  // ฟังก์ชันอัปเดตข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ฟังก์ชันเมื่อ User คลิกออกจาก Input (On Blur)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // ถ้า User กด Submit เลยโดยไม่คลิกช่องอื่น ให้ถือว่า touched ทุกช่องเพื่อโชว์ error (ถ้ามี)
    setTouched({
        f: true, e: true, p: true, pw: true, confirmPw: true
    });

    const payload = {
      f: formData.f,
      e: formData.e,
      p: parseInt(formData.p, 10),
      pw: formData.pw
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('สร้างบัญชีสำเร็จ!');
        // Reset form หรือ Redirect
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  // Helper สำหรับแสดง Error Message และเปลี่ยนสีขอบ
  // รับค่า: valid (ผ่านไหม), touched (เคยคลิกไหม), message (ข้อความเตือน)
  const renderError = (isValid: boolean, isTouched: boolean, message: string) => {
    if (isTouched && !isValid) {
      return (
        <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-pulse">
          <AlertCircle className="w-3 h-3" />
          <span>{message}</span>
        </div>
      );
    }
    return null;
  };

  // Function คืนค่า Class ของ Input (เปลี่ยนสีขอบถ้าผิด)
  const getInputClass = (isValid: boolean, isTouched: boolean) => {
    const baseStyle = `w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition duration-200`;
    if (isTouched && !isValid) {
      return `${baseStyle} border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500`;
    }
    return `${baseStyle} border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500`;
  };

  const inputContainerStyle = `relative flex flex-col mt-3`; // เปลี่ยนเป็น flex-col เพื่อให้ error อยู่บรรทัดใหม่
  const iconWrapperStyle = `relative w-full`; // Wrapper สำหรับ input และ icon
  const iconStyle = `w-5 h-5 text-gray-400 absolute left-3 top-3.5`; // ปรับ top ให้ตรงกลาง

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden min-h-[700px]">

        {/* Branding Section */}
        <div className="hidden md:flex w-1/2 bg-amber-500 flex-col justify-center items-center text-white p-8 relative">
          <div className="absolute top-10 left-10 bg-white/20 w-20 h-20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 bg-amber-600/50 w-32 h-32 rounded-full blur-xl"></div>
          <h2 className="text-4xl font-bold mb-4 z-10">Join Us Today</h2>
          <p className="text-center text-amber-100 z-10 mb-6">
            เริ่มต้นการเดินทางของคุณกับเรา สร้างบัญชีใหม่ได้ง่ายๆ เพียงไม่กี่ขั้นตอน
          </p>
          <ul className="space-y-3 text-amber-50 z-10 text-sm">
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> เข้าถึงฟีเจอร์ระดับพรีเมียม</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> อัปเดตข่าวสารก่อนใคร</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> ระบบความปลอดภัยสูงสุด</li>
          </ul>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 mt-2">Sign up for free to start.</p>
          </div>

          <form className="flex flex-col gap-1" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className={inputContainerStyle}>
              <div className={iconWrapperStyle}>
                <User className={iconStyle} />
                <input 
                  type="text" name="f"
                  value={formData.f}
                  onChange={handleChange}
                  onBlur={handleBlur} // เพิ่ม onBlur
                  placeholder="Full Name" 
                  className={getInputClass(isFullnameValid, touched.f)}
                />
              </div>
              {renderError(isFullnameValid, touched.f, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร")}
            </div>

            {/* Email */}
            <div className={inputContainerStyle}>
               <div className={iconWrapperStyle}>
                <Mail className={iconStyle} />
                <input 
                  type="email" name="e"
                  value={formData.e}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email Address" 
                  className={getInputClass(isEmailValid, touched.e)}
                />
              </div>
              {renderError(isEmailValid, touched.e, "รูปแบบอีเมลไม่ถูกต้อง (เช่น name@domain.com)")}
            </div>

            {/* Phone */}
            <div className={inputContainerStyle}>
              <div className={iconWrapperStyle}>
                <Phone className={iconStyle} />
                <input 
                  type="text" name="p"
                  value={formData.p}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Phone Number" 
                  className={getInputClass(isPhoneValid, touched.p)}
                  maxLength={10}
                />
              </div>
              {renderError(isPhoneValid, touched.p, "เบอร์โทรต้องเป็นตัวเลข 8-10 หลัก")}
            </div>

            {/* Password */}
            <div className={inputContainerStyle}>
              <div className={iconWrapperStyle}>
                <Lock className={iconStyle} />
                <input 
                  type="password" name="pw"
                  value={formData.pw}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password" 
                  className={getInputClass(isPasswordValid, touched.pw)}
                />
              </div>
              {renderError(isPasswordValid, touched.pw, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")}
            </div>

            {/* Confirm Password */}
            <div className={inputContainerStyle}>
              <div className={iconWrapperStyle}>
                <Lock className={iconStyle} />
                <input 
                  type="password" name="confirmPw"
                  value={formData.confirmPw}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm Password" 
                  className={getInputClass(isPasswordMatch, touched.confirmPw)}
                />
              </div>
              {renderError(isPasswordMatch, touched.confirmPw, "รหัสผ่านไม่ตรงกัน")}
            </div>

            {/* Terms */}
            <div className="flex flex-col mt-4">
                <div className="flex items-start text-sm text-gray-600">
                    <input 
                        type="checkbox" name="agreeTerm"
                        checked={formData.agreeTerm}
                        onChange={handleChange}
                        className="mt-1 mr-2 accent-amber-500" 
                    />
                    <span>
                        I agree to the <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
                    </span>
                </div>
            </div>

            {/* Button */}
            <button 
              type="submit"
              disabled={!isFormValid}
              className={`mt-6 font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center gap-2 shadow-lg 
                ${isFormValid 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white transform hover:-translate-y-0.5 hover:shadow-xl cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="login" className="text-amber-600 font-bold hover:underline">
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
