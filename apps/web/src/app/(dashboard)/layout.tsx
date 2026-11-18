import type { ReactNode } from 'react';

import { AppShell } from '@/widgets/app-shell';
import { AppSidebar } from '@/widgets/app-sidebar';
import { UserMenu } from '@/widgets/user-menu';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell sidebar={<AppSidebar />} header={<UserMenu />}>
      {children}
    </AppShell>
  );
}
