# Переключение языка интерфейса (ru / uk / en)

## Context
Весь UI сейчас захардкожен на русском (формы, страницы, ошибки zod, `ApiError` в `http.ts`), юридические страницы — на украинском. Нужно добавить поддержку русского, украинского и английского, переводы и временный переключатель языка на экране. Выбранный язык хранится в `localStorage`, по умолчанию `ru`, маршруты без префикса локали (как и сессия — всё клиентское). Внешние i18n-библиотеки не нужны: словарей три, строк немного — делаем лёгкий собственный провайдер.

## Подход

### 1. `shared/i18n` (новый сегмент, без бизнес-логики)
- `config.ts` — `locales = ['ru','uk','en'] as const`, `Locale`, `defaultLocale = 'ru'`, `localeLabels` (`RU / UA / EN`), `STORAGE_KEY = 'expense-tracker.locale'`.
- `messages/ru.ts` (источник типа `Messages`), `messages/uk.ts`, `messages/en.ts` — вложенные объекты, `uk`/`en` типизированы как `Messages`, чтобы компилятор ловил недостающие ключи. Секции: `common`, `auth.login`, `auth.register`, `auth.validation`, `errors`, `home`, `legal`.
- `i18n-provider.tsx` (`'use client'`) — контекст `{ locale, setLocale, t }`; по паттерну `SessionProvider`: начальное значение `defaultLocale`, в `useEffect` читаем `localStorage` (try/catch), в `setLocale` пишем в storage и ставим `document.documentElement.lang`. `t(key, params?)` — типизированный dot-путь (`MessageKey`) и интерполяция `{name}`.
- `index.ts` — публичный API: `I18nProvider`, `useI18n`, типы.
- Минус: у пользователей uk/en при первой отрисовке мелькнёт `ru` (как и `ready` у сессии). SSR-cookie не делаем — переключатель временный.

### 2. Переключатель — `features/language-switcher`
- `ui/language-switcher.tsx` — три кнопки (`Button variant` outline/default для активного), использует `useI18n`. Комментарий `// TODO: временный переключатель`.
- Монтируется в `app/layout.tsx` внутри `I18nProvider` в `fixed right-4 top-4 z-50` — виден на всех экранах, включая юридические страницы. `<html lang="ru">` остаётся дефолтом, провайдер обновляет атрибут.

### 3. Перевод существующих экранов
- `app/layout.tsx`: обернуть `I18nProvider` вокруг `SessionProvider`.
- `features/auth-login/ui/login-form.tsx`, `features/auth-register/ui/register-form.tsx`, `views/login`, `views/register`, `views/home` (`home-page.tsx` — «Привет, {name}», «Выйти»): заменить строки на `t(...)`. Серверные компоненты `login-page`/`register-page` становятся клиентскими (`'use client'`) или выносят текст в клиентский компонент — проще добавить `'use client'`.
- Схемы zod (`auth-login/model/schema.ts`, `auth-register/model/schema.ts`): в сообщениях вместо русского текста — ключи (`'auth.validation.email'`), форма рендерит `t(errors.x.message as MessageKey)`. Так ошибки перерисовываются при смене языка без пересоздания схемы.
- Серверные ошибки (`use-login-form.ts`, `use-register-form.ts`): хранить в state ключ (`'auth.login.invalidCredentials'`, `'auth.register.emailTaken'`, `'errors.generic'`) либо сырой текст из `ApiError.messages` (текст бэкенда не переводим); форма переводит ключи при рендере.
- `shared/api/http.ts`: вместо русской строки сетевой ошибки бросать `ApiError(0, [])`, а хуки форм маппят `status === 0` → `errors.network`. (shared не импортирует i18n.)

### 4. Юридические страницы (сейчас только украинский)
- `widgets/legal-document/ui/legal-document.tsx` → `'use client'`; «← Назад к регистрации» и «Редакция от» через `t('legal.*')`.
- `views/terms/ui/` и `views/privacy/ui/`: разнести текст на `terms-content-uk.tsx`, `terms-content-ru.tsx`, `terms-content-en.tsx` (аналогично для privacy); `TermsPage`/`PrivacyPage` — клиентские, выбирают контент и заголовок по `locale`. Украинский текст остаётся без изменений, русский и английский — перевод (плейсхолдеры `[… заполнить перед публикацией]` тоже переводятся). Ссылки Terms↔Privacy сохраняются.
- Замечание в ответе пользователю: переводы юридических текстов — информационные, правовую силу для Украины имеет украинская версия; стоит показать юристу.

### 5. Документация
- `CLAUDE.md`: заменить «UI text is in Russian» на описание i18n (`shared/i18n`, три локали, как добавлять строки: сначала `ru.ts`, затем `uk.ts`/`en.ts`), упомянуть временный `features/language-switcher`.

## Чеклист
Первым действием после одобрения: скопировать этот план в `.claude/plans/i18n-language-switcher.md` (в режиме планирования писать в репозиторий нельзя) и по ходу работы отмечать пункты `[x]` именно там.

- [x] План скопирован в `.claude/plans/i18n-language-switcher.md`
- [x] `shared/i18n`: config, провайдер, `useI18n`, `index.ts`
- [x] Словари `ru` / `uk` / `en` (common, auth, validation, errors, home, legal)
- [x] `features/language-switcher` + монтирование в `app/layout.tsx` (временный, fixed в углу)
- [x] Формы логина/регистрации, страницы login/register/home переведены
- [x] Схемы zod на ключи, серверные ошибки через ключи, `http.ts` без русской строки
- [x] Юридические страницы: контент uk/ru/en, `LegalDocument` переведён
- [x] `CLAUDE.md` обновлён
- [x] `npm run lint` и `npm run build -w apps/web` проходят
- [ ] Ручная проверка переключения на всех экранах (в браузере)

## Критичные файлы
- Новые: `apps/web/src/shared/i18n/{config.ts,i18n-provider.tsx,index.ts,messages/{ru,uk,en}.ts}`, `apps/web/src/features/language-switcher/{index.ts,ui/language-switcher.tsx}`, `views/terms/ui/terms-content-{uk,ru,en}.tsx`, `views/privacy/ui/privacy-content-{uk,ru,en}.tsx`.
- Изменяемые: `app/layout.tsx`, обе формы + их схемы и хуки, `views/{login,register,home,terms,privacy}/ui/*`, `widgets/legal-document/ui/legal-document.tsx`, `shared/api/http.ts`, `CLAUDE.md`.

## Проверка
1. `npm run lint` и `npm run build -w apps/web` (проверка типов: недостающий ключ в `uk`/`en` должен ломать сборку).
2. `npm run dev:web`: на `/login`, `/register`, `/terms`, `/privacy`, `/` переключить RU/UA/EN — весь текст меняется, включая ошибки валидации (отправить пустую форму, сменить язык — ошибки переводятся) и подпись кнопки.
3. Перезагрузить страницу — выбранный язык сохраняется; `document.documentElement.lang` соответствует.
4. Остановить API и отправить форму — сообщение о недоступности сервера переводится.
