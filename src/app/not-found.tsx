import Link from 'next/link'

const NotFound = () => {
  return (
    <>
      <div className='h-dvh w-dvw flex flex-col justify-center items-center space-y-2'>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className='bg-gray-400 rounded-2xl px-4 py-2 hover:bg-gray-600 active:bg-gray-700 duration-150'>Go back to home</Link>
      </div>
    </>
  );
};

export default NotFound;
