import { cn } from '@/lib/utils';

const RowContainer: React.FC<React.ComponentProps<'div'>> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={cn('flex h-6 cursor-default items-center justify-start truncate ps-2 capitalize', props.className)}
    >
      {children}
    </div>
  );
};

export default RowContainer;
