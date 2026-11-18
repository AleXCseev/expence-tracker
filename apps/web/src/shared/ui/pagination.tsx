import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
  statusLabel: string;
  disabled?: boolean;
}

function Pagination({
  page,
  pages,
  onPageChange,
  prevLabel,
  nextLabel,
  statusLabel,
  disabled,
}: PaginationProps) {
  return (
    <nav className="flex items-center justify-between gap-2" aria-label="pagination">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        {prevLabel}
      </Button>
      <span className="text-sm text-muted-foreground">{statusLabel}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
