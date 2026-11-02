import type { Messages } from './ru';

export const en: Messages = {
  common: {
    email: 'Email',
    password: 'Password',
    name: 'Name',
  },
  auth: {
    login: {
      title: 'Sign in',
      description: 'Sign in to your Expense Tracker account',
      submit: 'Sign in',
      submitting: 'Signing in…',
      noAccount: 'Don’t have an account?',
      toRegister: 'Sign up',
      invalidCredentials: 'Invalid email or password',
    },
    register: {
      title: 'Sign up',
      description: 'Create an account to track your expenses',
      submit: 'Sign up',
      submitting: 'Creating account…',
      haveAccount: 'Already have an account?',
      toLogin: 'Sign in',
      emailTaken: 'A user with this email is already registered',
      agreePrefix: 'I agree to the',
      termsLink: 'terms of service',
      and: 'and the',
      privacyLink: 'personal data processing policy',
    },
    validation: {
      email: 'Enter a valid email',
      passwordRequired: 'Enter your password',
      passwordMax: 'At most 72 characters',
      passwordMin: 'At least 8 characters',
      nameRequired: 'Enter your name',
      nameMax: 'At most 100 characters',
      agreed: 'You must accept the terms to continue',
    },
  },
  errors: {
    generic: 'Something went wrong',
    network: 'Could not connect to the server',
  },
  home: {
    greeting: 'Hello, {name}!',
    signOut: 'Sign out',
  },
  legal: {
    backToRegister: '← Back to sign up',
    revisionFrom: 'Last updated: {date}',
  },
};
