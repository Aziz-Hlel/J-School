import { useFile } from '../context/fileProvider';

const CircularProgressBar = () => {
  const { progress } = useFile();
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((100 - progress) / 100) * circumference;

  return (
    <div className='z-50 flex items-center justify-center'>
      <svg className='h-5 w-5 -rotate-90' viewBox='0 0 100 100'>
        {/* Background Circle */}
        <circle
          cx='50'
          cy='50'
          r={radius}
          fill='transparent'
          strokeWidth='10'
          className='bg-gray-200 stroke-blue-600'
        />

        {/* Progress Circle */}
        <circle
          cx='50'
          cy='50'
          r={radius}
          fill='transparent'
          strokeWidth='10'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className='bg-blue-600 stroke-current transition-all duration-500 ease-in-out'
        />
      </svg>

      {/* Optional Percentage Text */}
    </div>
  );
};

export default CircularProgressBar;
