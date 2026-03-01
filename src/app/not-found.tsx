import Link from 'next/link'

const NotFound = () => {
  return (
    <>
      <div className='w-dvw h-dvh flex flex-col justify-center items-center space-y-2 bg-bg text-text'>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className='bg-primary/60 rounded-2xl px-4 py-2 hover:bg-primary/70 active:bg-primary/80 duration-150'>Go back to home</Link>
      </div>
    </>
  );
};

export default NotFound;
