'use client';

import { LogOut } from 'lucide-react';

import { useSession } from '@/entities/session';
import { LanguageSwitcher } from '@/features/language-switcher';
import { useI18n } from '@/shared/i18n';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';

export function UserMenu() {
  const { t } = useI18n();
  const { user, signOut } = useSession();

  if (!user) return null;

  const initials = user.name.trim().slice(0, 1).toUpperCase() || '?';

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <div className="flex items-center gap-2">
        <Avatar aria-hidden>{initials}</Avatar>
        <div className="hidden min-w-0 leading-tight sm:block">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={signOut} aria-label={t('profile.signOut')}>
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
