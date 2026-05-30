# Vantoryn — Developer Reference

**Live site:** https://vantoryn.vercel.app  
**Repo:** https://github.com/dbordusenko/vantoryn  
**Deploy:** Vercel, auto-deploy on `git push origin master`

---

## Stack

| Слой | Технология |
|------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | CSS-in-JS (inline styles), no CSS files |
| Icons | lucide-react |
| Fonts | Inter (Google Fonts, loaded in index.html) |
| Routing | State-based (нет react-router) |
| Auth | localStorage (`vantoryn_auth`) |
| Data | localStorage only (нет backend) |
| Deploy | Vercel (static SPA) |

---

## Быстрый старт

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

---

## Архитектура

### Роутинг

Роутинг полностью через `useState` в `App.jsx`. Нет URL-изменений, нет react-router.

```js
// App.jsx
const PAGES = {
  home, platform, solutions, security,
  pricing, insights, product, cabinet, logos
}

const AUTH_PAGES = new Set(['product', 'cabinet'])
// Попытка перейти на auth-страницу без сессии → открывает Login overlay
```

Навигация вызывается через `navigate(pageName)` prop, который передаётся в каждый компонент страницы.

### Передача пропсов

Каждая страница получает стандартный набор пропсов из `App.jsx`:

```jsx
<Page
  navigate={navigate}       // fn(pageName) — переход между страницами
  session={session}         // null | { name, email, org } — текущий пользователь
  onLogout={handleLogout}   // только Cabinet
  onBookDemo={() => setShowBookDemo(true)}
  onWaitlist={() => setShowWaitlist(true)}
/>
```

**Важно:** если страница вызывает `onBookDemo` или `onWaitlist`, она должна принять эти пропсы в сигнатуре функции — иначе ReferenceError и белый экран.

---

## Дизайн-система (`src/tokens.js`)

Весь дизайн строится через токены. **Не хардкодь цвета и шрифты напрямую.**

```js
import { C, f, FONT, btn, GLOBAL_STYLES } from '../tokens'

// Цвета
C.bg0       // '#04050a' — самый тёмный фон
C.bg1       // '#080b13'
C.bg2       // '#0c1019'
C.bg3       // '#111622'
C.t1        // '#eef2fa' — основной текст
C.t2        // '#7e8fa8' — вторичный текст
C.t3        // '#374256' — приглушённый
C.t4        // '#1e2a3a' — очень приглушённый
C.blue      // '#3b7fff' — primary accent
C.blueD     // '#2563eb' — hover state для blue
C.blueGlow  // '#3b7fff28' — box-shadow glow
C.teal      // '#00c5b5'
C.green     // '#22c55e'
C.amber     // '#f59e0b'
C.red       // '#f87171'
C.purple    // '#818cf8'
C.border    // '#171e30' — тонкие разделители
C.borderMid // '#1f293f' — стандартные border
C.borderHi  // '#2a3a58' — выделенные border

// f() — добавляет fontFamily ко всем стилям
f({ fontSize: 14, color: C.t1 })
// → { fontFamily: "'Inter'...", fontSize: 14, color: '#eef2fa' }

// btn() — готовые стили для кнопок
btn(C.blue).primary   // синяя кнопка с glow
btn(C.blue).ghost     // прозрачная кнопка с border

// GLOBAL_STYLES — CSS анимации (вставляется через <style> в App.jsx)
// fadeUp, pulseGreen, fadeIn, pageFade, spin
```

---

## Структура файлов

```
frontend/
├── index.html              # подключает Inter, favicon
├── vite.config.js
├── package.json
└── src/
    ├── App.jsx             # роутер, глобальный стейт, модалы
    ├── tokens.js           # дизайн-система
    │
    ├── pages/
    │   ├── Home.jsx        # обёртка → VantorynLanding
    │   ├── Platform.jsx    # страница Platform
    │   ├── Solutions.jsx   # страница Solutions (Use Cases)
    │   ├── Security.jsx    # страница Security
    │   ├── Insights.jsx    # страница Insights / Blog
    │   ├── Pricing.jsx     # страница Pricing (3 плана)
    │   ├── Login.jsx       # Sign In + Create Account (2 формы в одном файле)
    │   ├── Cabinet.jsx     # Личный кабинет (табы: Overview, Profile, Security, Waitlist*)
    │   ├── Product.jsx     # Основное приложение (после логина)
    │   └── LogoShowcase.jsx  # /logos — витрина логотипа
    │
    └── components/
        ├── VantorynLanding.jsx   # Весь контент главной страницы
        │                         # (Nav, Hero, TrustBar, секции, Footer)
        ├── Nav.jsx               # Шапка навигации (все страницы кроме product)
        ├── BookDemoModal.jsx     # 3-шаговый модал "Book CFO Demo"
        ├── WaitlistModal.jsx     # Модал вейтлиста
        └── VantorynMark.jsx      # SVG логотип-иконка
```

---

## Аутентификация

Реализована полностью на `localStorage`, без backend.

```js
// src/pages/Login.jsx — экспортируемые утилиты
import Login, { loadSession, clearSession } from './pages/Login'

loadSession()   // → { name, email, org, exp } | null (проверяет TTL 7 дней)
clearSession()  // удаляет сессию

// localStorage keys:
// 'vantoryn_auth'   — текущая сессия { name, email, org, exp }
// 'vantoryn_users'  — массив зарегистрированных пользователей
```

**Demo credentials (захардкожены в Login.jsx):**
- `demo@vantoryn.ai` / `demo2024`
- `cfo@techcorp.com` / `finance123`
- `admin@vantoryn.ai` / `admin2024` (имеет доступ к таблице вейтлиста в Cabinet)

---

## Вейтлист

```js
// src/components/WaitlistModal.jsx — экспортируемые утилиты
import { getWaitlistData, getWaitlistCount } from './components/WaitlistModal'

getWaitlistData()   // → массив всех записей
getWaitlistCount()  // → число записей

// localStorage key: 'vantoryn_waitlist'
// Структура записи: { name, email, company, revenue, role, at: ISO-дата }
```

**Просмотр вейтлиста:** войти как `admin@vantoryn.ai` → Cabinet → таб "Waitlist ✦"

---

## Модалы

Оба модала управляются стейтом в `App.jsx` и рендерятся поверх любой страницы.

```jsx
// Открыть Book Demo:
onBookDemo()   // → setShowBookDemo(true)

// Открыть Waitlist:
onWaitlist()   // → setShowWaitlist(true)
```

**BookDemoModal** — 3 шага: форма (имя/email/компания/роль/размер) → выбор времени → подтверждение.  
**WaitlistModal** — форма + детект дублей email + счётчик позиции.

---

## Добавить новую страницу

1. Создать `src/pages/MyPage.jsx`:
```jsx
import { C, f } from '../tokens'

export default function MyPage({ navigate, session, onBookDemo, onWaitlist }) {
  return (
    <div style={{ background: C.bg0, minHeight: '100vh', paddingTop: 80 }}>
      {/* контент */}
    </div>
  )
}
```

2. Зарегистрировать в `App.jsx`:
```js
import MyPage from './pages/MyPage'
const PAGES = { ..., mypage: MyPage }
```

3. Если страница требует авторизации:
```js
const AUTH_PAGES = new Set(['product', 'cabinet', 'mypage'])
```

---

## Добавить новый модал

1. Создать компонент с `onClose` пропом
2. В `App.jsx` добавить стейт и рендер:
```jsx
const [showMyModal, setShowMyModal] = useState(false)
// в render:
{showMyModal && <MyModal onClose={() => setShowMyModal(false)} />}
```
3. Передать `onMyModal={() => setShowMyModal(true)}` в `<Nav>` и `<Page>`

---

## Типичные паттерны

### Секция страницы
```jsx
<section style={{ background: C.bg1, padding: '96px 28px', borderTop: `1px solid ${C.border}` }}>
  <div style={{ maxWidth: 1160, margin: '0 auto' }}>
    {/* контент */}
  </div>
</section>
```

### Карточка
```jsx
<div style={{
  background: C.bg2, border: `1px solid ${C.borderMid}`,
  borderRadius: 14, padding: 24,
}}>
```

### Кнопка primary
```jsx
<button onClick={...} style={f({
  background: C.blue, border: 'none', borderRadius: 10,
  color: '#fff', fontSize: 14, fontWeight: 600,
  padding: '11px 24px', cursor: 'pointer',
  boxShadow: `0 4px 20px ${C.blue}40`,
  transition: 'all 0.2s',
})}
onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
>
  Label
</button>
```

### Pill / badge
```jsx
<div style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: `${C.blue}14`, border: `1px solid ${C.blue}35`,
  borderRadius: 20, padding: '5px 12px',
}}>
  <span style={f({ fontSize: 12, color: C.blue, fontWeight: 600 })}>Label</span>
</div>
```

---

## VantorynLanding.jsx — структура

Главная страница состоит из секций в одном файле (~1200 строк):

```
Nav (внутренний, только для /home)
Hero
TrustBar
FinancialAnxietySection
PlatformSection
HowItWorksSection
ExecutiveBriefingSection
ImpactSection
BeforeAfterSection
SecuritySection
UseCasesSection
FinalCTA
Footer
```

**Важно:** `VantorynLanding.jsx` имеет свои локальные копии токенов `C`, `FONT`, `f` (не импортирует из `tokens.js`). При изменении глобальных токенов нужно синхронизировать вручную.

---

## Product.jsx — приложение

Доступно только после логина (`/product`). Содержит:
- Sidebar с разделами
- Dashboard (KPI карточки, графики)
- Reports, Forecasting, AI Brief, Settings

Все данные статичные (моковые). Нет реального backend подключения.

---

## Известные особенности

- **Нет URL routing** — обновление страницы всегда возвращает на home
- **Нет backend** — все данные в localStorage, сбрасываются при очистке браузера
- **VantorynLanding имеет дублированные токены** — синхронизировать при изменении цветов
- **`Settings → Save Changes`** в Product.jsx не сохраняет (нет feedback/toast) — косметический баг
- **Mobile** — Nav адаптивен, но страницы не полностью оптимизированы под мобайл
