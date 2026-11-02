export const ru = {
  common: {
    email: 'Email',
    password: 'Пароль',
    name: 'Имя',
  },
  auth: {
    login: {
      title: 'Вход',
      description: 'Войдите в свой аккаунт Expense Tracker',
      submit: 'Войти',
      submitting: 'Входим…',
      noAccount: 'Нет аккаунта?',
      toRegister: 'Зарегистрироваться',
      invalidCredentials: 'Неверный email или пароль',
    },
    register: {
      title: 'Регистрация',
      description: 'Создайте аккаунт, чтобы вести учёт расходов',
      submit: 'Зарегистрироваться',
      submitting: 'Создаём аккаунт…',
      haveAccount: 'Уже есть аккаунт?',
      toLogin: 'Войти',
      emailTaken: 'Пользователь с таким email уже зарегистрирован',
      agreePrefix: 'Я согласен с',
      termsLink: 'пользовательским соглашением',
      and: 'и',
      privacyLink: 'политикой обработки персональных данных',
    },
    validation: {
      email: 'Введите корректный email',
      passwordRequired: 'Введите пароль',
      passwordMax: 'Не более 72 символов',
      passwordMin: 'Минимум 8 символов',
      nameRequired: 'Введите имя',
      nameMax: 'Не более 100 символов',
      agreed: 'Необходимо принять условия, чтобы продолжить',
    },
  },
  errors: {
    generic: 'Что-то пошло не так',
    network: 'Не удалось подключиться к серверу',
  },
  home: {
    greeting: 'Привет, {name}!',
    signOut: 'Выйти',
  },
  legal: {
    backToRegister: '← Назад к регистрации',
    revisionFrom: 'Редакция от {date}',
  },
};

export type Messages = typeof ru;
