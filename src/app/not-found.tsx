import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex flex-col w-dvh h-dvh justify-center items-center">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className='bg-gray-200 rounded h-10 w-50 justify-center items-center text-center'>Go back to home</Link>
    </div>
  );
};

export default NotFound;
