import Link from "next/link";

const LoginPage = () => {
  return (
    <>
      <div className="flex min-h-dvh w-full items-center justify-center p-6 bg-surface sm:bg-bg">
        <div className="w-full max-w-100 min-w-80 bg-surface p-8 rounded-3xl sm:shadow-xl sm:border border-muted/10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
            <p className="text-muted text-sm">กรุณาเข้าสู่ระบบ</p>
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold pl-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-bg border border-muted/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <button className="w-full py-4 bg-primary text-bg font-bold rounded-2xl mt-4 hover:shadow-lg shadow-primary/20 transition-all active:scale-95">
              SIGN IN
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-muted">
            ยังไม่มีบัญชีใช่ไหม? <Link href="/auth/register" className="text-primary font-bold hover:underline">สมัครสมาชิก</Link>
          </p>
          <Link href="/" className="text-muted text-center w-full">
            <p className="text-center pt-2">กลับไปหน้าหลัก</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
