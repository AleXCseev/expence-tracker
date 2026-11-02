'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { useRegisterForm } from '../model/use-register-form';

export function RegisterForm() {
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
        <Label htmlFor="name">Имя</Label>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
            Я согласен с{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-foreground underline underline-offset-4"
            >
              пользовательским соглашением
            </Link>{' '}
            и{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-foreground underline underline-offset-4"
            >
              политикой обработки персональных данных
            </Link>
          </Label>
        </div>
        {errors.agreed && <p className="text-sm text-destructive">{errors.agreed.message}</p>}
      </div>
      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
}
