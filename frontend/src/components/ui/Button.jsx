import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const variantClasses = {
  default: 'bg-[#0C66E4] text-white hover:bg-[#0055CC] shadow-xs active:bg-[#0047B3]',
  primary: 'bg-[#0C66E4] text-white hover:bg-[#0055CC] shadow-xs active:bg-[#0047B3]',
  destructive: 'bg-[#E5493A] text-white hover:bg-[#CA3521]',
  danger: 'bg-[#E5493A] text-white hover:bg-[#CA3521]',
  outline: 'border border-[#333C44] bg-[#22272B] hover:bg-[#282E33] text-[#DEE4EA]',
  secondary: 'bg-[#282E33] text-[#DEE4EA] hover:bg-[#333C44]',
  ghost: 'hover:bg-[#282E33] text-[#9FADBC] hover:text-[#DEE4EA]',
  link: 'text-[#579DFF] underline-offset-4 hover:underline',
};

const sizeClasses = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-md px-8 text-base',
  icon: 'h-9 w-9 p-0',
  'icon-sm': 'h-8 w-8 p-0',
};

export function buttonVariants({ variant = 'default', size = 'default', className } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#579DFF] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  );
}

const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      icon: Icon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
