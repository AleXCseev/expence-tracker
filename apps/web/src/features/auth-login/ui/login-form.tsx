'use client';

import { useI18n, type MessageKey } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useLoginForm } from '../model/use-login-form';

export function LoginForm() {
  const { t } = useI18n();
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    serverError,
  } = useLoginForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('common.email')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{t(errors.email.message as MessageKey)}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t('common.password')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{t(errors.password.message as MessageKey)}</p>
        )}
      </div>
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {'key' in serverError ? t(serverError.key) : serverError.text}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>
    </form>
  );
}
