import { cn } from '../../lib/utils';

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
        className
      )}
      {...props}
    />
  );
}
