'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { useI18n, type MessageKey } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useRegisterForm } from '../model/use-register-form';

export function RegisterForm() {
  const { t } = useI18n();
  const {
    form: {
      register,
      control,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    serverError,
  } = useRegisterForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{t('common.name')}</Label>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{t(errors.name.message as MessageKey)}</p>
        )}
      </div>
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
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{t(errors.password.message as MessageKey)}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <Controller
            control={control}
            name="agreed"
            render={({ field }) => (
              <Checkbox
                id="agreed"
                className="mt-0.5"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                aria-invalid={!!errors.agreed}
              />
            )}
          />
          <Label htmlFor="agreed" className="inline text-sm leading-snug font-normal">
            {t('auth.register.agreePrefix')}{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-foreground underline underline-offset-4"
            >
              {t('auth.register.termsLink')}
            </Link>{' '}
            {t('auth.register.and')}{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-foreground underline underline-offset-4"
            >
              {t('auth.register.privacyLink')}
            </Link>
          </Label>
        </div>
        {errors.agreed && (
          <p className="text-sm text-destructive">{t(errors.agreed.message as MessageKey)}</p>
        )}
      </div>
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {'key' in serverError ? t(serverError.key) : serverError.text}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
      </Button>
    </form>
  );
}
