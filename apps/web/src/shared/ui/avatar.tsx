import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground select-none',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar };
