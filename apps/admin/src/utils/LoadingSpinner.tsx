const LoadingSpinner = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
