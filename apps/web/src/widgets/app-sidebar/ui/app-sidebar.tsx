'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftRight, Tags, type LucideIcon } from 'lucide-react';

import { useI18n, type MessageKey } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';

const items: { href: string; label: MessageKey; icon: LucideIcon }[] = [
  { href: '/', label: 'nav.transactions', icon: ArrowLeftRight },
  { href: '/categories', label: 'nav.categories', icon: Tags },
];

export function AppSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <aside className="border-b bg-card md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="hidden px-6 py-5 text-lg font-semibold md:block">{t('nav.appName')}</div>
      <nav
        aria-label={t('nav.menu')}
        className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:px-3 md:py-0"
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="size-4" />
              {t(label)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
