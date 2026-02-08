'use client'

const Login = () => {
  
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center overflow-auto">
        <div className="bg-amber-200 w-[405px] text-center space-y-4 p-7 rounded">
          <h1 className="font-bold">Sign In To Web Application</h1>
          <div className="flex flex-col space-y-4">
            <input className="bg-white p-2 rounded "
              type="text" placeholder="Username" />
            <input className="bg-white p-2 rounded"
              type="password" placeholder="Password" />              
          </div>
          <div className="flex justify-around">
            <div>
              <input type="checkbox" className="mr-2" />
              <label>Remember me</label>
            </div>
            <button className="hover:underline">forget password</button>
          </div>
          <button className="bg-amber-500 px-2 py-1 rounded active:bg-amber-600 hover:bg-amber-400">LOGIN</button>
          <div className="flex justify-center items-center">
            <hr className="w-full"/>
            <h1 className="w-full">or login with</h1>
            <hr className="w-full"/>
          </div>
          {/*ทางเลือกการล็อกอินด้วย gmail หรือ อื่นๆ*/}
          <div className="flex flex-col space-y-4">
            <div className="bg-amber-500 h-7 rounded"></div>
            <div className="bg-amber-500 h-7 rounded"></div>            
          </div>
          <div className="flex justify-around items-center">
            <h1 className="">don't have an account?</h1>
            <button className="text-orange-400 hover:underline hover:text-black">REGISTER</button>
          </div>
        </div>
        <div className="h-40">
          
        </div>
      </div>
    </>
  )
}

const Register = () => {
  return (
    <>
      
    </>
  )
}


export { Login, Register }
