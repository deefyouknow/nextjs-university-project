'use client'
import { useGlobal } from '@/components/globalvar/globalvariable';
import { Login, Register } from '@/components/loginpage/authentication';
import { Home } from '@/components/home';

const App = () => {
  const {var1, setVar1} = useGlobal();
  return (
    <>
      {var1 ? <Home /> : <Register />}
    </>
  )
}

export default App
