import { AppProps } from '@/app/page';

export const BodyStyle: React.FC<AppProps> = ({flexallcenter}) => {
  return (
    <div className={`bg-emerald-100 w-full h-full flex justify-center items-center absolute z-10 flex-col`}>
      <div className={`h-16`}></div>
      <ContentOnbody />
    </div>
  )
}

const ContentOnbody = () => {
  return (
    <div className={`bg-gray-300 h-full flex flex-col pt-5 px-6 w-full max-w-7xl`}>
      <h1>dsfdsf</h1>
      <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-800 hover:bg-blue-100`}>Click Me</button>
    </div>
  )
}
