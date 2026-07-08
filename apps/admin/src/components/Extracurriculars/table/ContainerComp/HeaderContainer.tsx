import { cn } from '@/lib/utils';

const HeaderContainer: React.FC<React.ComponentProps<'div'>> = ({ children, ...props }) => {
  return (
    <div
      className={cn(
        "flex w-auto cursor-pointer items-center justify-start space-x-2 truncate rounded-md ps-2 text-sm font-medium whitespace-nowrap transition-all [&_svg:not([class*='size-'])]:size-4",
        props.className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default HeaderContainer;
