import type { Messages } from './ru';

export const uk: Messages = {
  common: {
    email: 'Email',
    password: 'Пароль',
    name: 'Ім’я',
  },
  auth: {
    login: {
      title: 'Вхід',
      description: 'Увійдіть до свого акаунта Expense Tracker',
      submit: 'Увійти',
      submitting: 'Входимо…',
      noAccount: 'Немає акаунта?',
      toRegister: 'Зареєструватися',
      invalidCredentials: 'Неправильний email або пароль',
    },
    register: {
      title: 'Реєстрація',
      description: 'Створіть акаунт, щоб вести облік витрат',
      submit: 'Зареєструватися',
      submitting: 'Створюємо акаунт…',
      haveAccount: 'Вже є акаунт?',
      toLogin: 'Увійти',
      emailTaken: 'Користувач з таким email вже зареєстрований',
      agreePrefix: 'Я погоджуюсь з',
      termsLink: 'угодою користувача',
      and: 'та',
      privacyLink: 'політикою обробки персональних даних',
    },
    validation: {
      email: 'Введіть коректний email',
      passwordRequired: 'Введіть пароль',
      passwordMax: 'Не більше 72 символів',
      passwordMin: 'Мінімум 8 символів',
      nameRequired: 'Введіть ім’я',
      nameMax: 'Не більше 100 символів',
      agreed: 'Необхідно прийняти умови, щоб продовжити',
    },
  },
  errors: {
    generic: 'Щось пішло не так',
    network: 'Не вдалося підключитися до сервера',
  },
  home: {
    greeting: 'Привіт, {name}!',
    signOut: 'Вийти',
  },
  legal: {
    backToRegister: '← Назад до реєстрації',
    revisionFrom: 'Редакція від {date}',
  },
};
