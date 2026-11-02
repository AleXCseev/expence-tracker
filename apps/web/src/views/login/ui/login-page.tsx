'use client';

import Link from 'next/link';

import { LoginForm } from '@/features/auth-login';
import { useI18n } from '@/shared/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

export function LoginPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{t('auth.login.title')}</CardTitle>
          <CardDescription>{t('auth.login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {t('auth.login.noAccount')}&nbsp;
          <Link href="/register" className="text-foreground underline underline-offset-4">
            {t('auth.login.toRegister')}
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
