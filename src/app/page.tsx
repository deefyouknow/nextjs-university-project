'use client'
import { useGlobal } from '@/components/globalvar/globalvariable';
import { Login, Register } from '@/components/loginpage/authentication';

const App = () => {
  const {var1, setVar1} = useGlobal();
  return (
    <>
      {var1 ? <Login /> : <Register />}
    </>
  )
}

export default App
