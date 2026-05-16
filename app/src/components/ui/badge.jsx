import { cn } from '../../lib/utils';

const variantStyles = {
  default: 'bg-blue-100 text-blue-700 border-blue-200',
  secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  destructive: 'bg-red-100 text-red-700 border-red-200',
  outline: 'bg-white text-gray-700 border-gray-300',
};

export function Badge({ children, variant = 'default', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
