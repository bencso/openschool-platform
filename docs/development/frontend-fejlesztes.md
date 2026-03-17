# Frontend fejlesztés (React + TypeScript)

> 📖 **Dokumentáció:** [Főoldal](../../README.md) · [Architektúra](../getting-started/architektura.md) · [Telepítés](../getting-started/telepitesi-utmutato.md) · [Környezeti változók](../getting-started/kornyezeti-valtozok.md) · [Fejlesztői útmutató](fejlesztoi-utmutato.md) · [Backend](backend-fejlesztes.md) · **Frontend** · [Tesztelés](tesztelesi-utmutato.md) · [API referencia](../reference/api-referencia.md) · [Adatbázis](../reference/adatbazis-sema.md) · [Karbantartás](../operations/karbantartas-utmutato.md) · [Automatizálás](../operations/automatizalas-beallitas.md) · [GitHub Classroom](../integrations/github-classroom-integraciot.md) · [Discord](../integrations/discord-integracio.md) · [Felhasználói útmutató](../guides/felhasznaloi-utmutato.md) · [Dokumentálás](../guides/dokumentacios-utmutato.md) · [Roadmap](../jovokep-es-fejlesztesi-terv.md) · [Hozzájárulás](../../CONTRIBUTING.md)

Ez az útmutató a frontend fejlesztéséhez tartalmaz mindent: React + TypeScript projekt felépítés, oldalak, komponensek, stílusok, tesztelés és a backend API-val való kommunikáció.

> **Általános fejlesztői útmutató** (Docker, pre-commit, VS Code, Git, CI/CD, Makefile): [fejlesztoi-utmutato.md](fejlesztoi-utmutato.md)
> **Dokumentálási útmutató** (docstring-ek, API docs, README karbantartás): [dokumentacios-utmutato.md](../guides/dokumentacios-utmutato.md)

---

## 1. Telepítés és indítás

```bash
cd frontend
npm install
```

### Fejlesztői szerver

```bash
npm run dev     # Vite dev szerver: http://localhost:4321
```

A dev szerver hot reload-dal (HMR) működik — a fájl módosítások azonnal megjelennek a böngészőben.

A Vite dev szerver proxy-zzaa `/api` hívásokat a backend-re (`http://localhost:8000`), így lokális fejlesztés Docker nélkül is lehetséges. A teljes stack (backend + db + nginx) futtatásához a Docker Compose-t használd (`make up`).

### Build

```bash
npm run build    # TypeScript ellenőrzés + Vite build → dist/
```

A Vite egyetlen HTML fájlt és optimalizált JS/CSS bundle-t generál. A build kimenetet az nginx szolgálja ki. A böngészőből érkező `/api/*` hívásokat az nginx a FastAPI backend-re proxyzi.

### Típusellenőrzés

```bash
npx tsc --noEmit    # TypeScript ellenőrzés build nélkül
```

### Linting és formázás

A projekt ESLint-et használ lintingre és Prettier-t kódformázásra.

```bash
npm run lint          # ESLint ellenőrzés
npm run lint:fix      # ESLint automatikus javítás
npm run format:check  # Prettier formázás ellenőrzése
npm run format        # Prettier formázás (módosít)
```

**ESLint** (`eslint.config.js`): TypeScript + React szabályok, react-hooks és react-refresh pluginekkel. Flat config (ESLint 9).

**Prettier** (`.prettierrc`): Egységes kódformázás — singleQuote, trailingComma: all, printWidth: 100, tabWidth: 2.

A pre-commit hookok automatikusan futtatják mindkettőt commit előtt. A CI is ellenőrzi.

---

## 2. Könyvtárstruktúra

```
frontend/
├── vite.config.ts         # Vite konfiguráció (React plugin, proxy, Vitest)
├── eslint.config.js       # ESLint 9 flat config (TypeScript + React)
├── .prettierrc            # Prettier formázó beállítások
├── package.json           # Node.js függőségek
├── tsconfig.json          # TypeScript konfig (strict mód, React JSX)
│
├── public/                # Statikus fájlok (favicon, képek)
│
└── src/
    ├── main.tsx           # Belépési pont — React DOM render, BrowserRouter
    ├── App.tsx            # Útvonalak definíciója (React Router)
    │
    ├── styles/
    │   └── global.css     # Globális stílusok (CSS változók, card, btn, progress-bar)
    │
    ├── components/
    │   ├── Layout.tsx        # Fő layout — header, footer, auth navigáció, hamburger menü
    │   ├── CourseCard.tsx     # Kurzus kártya (név, leírás, link)
    │   └── ProgressBar.tsx   # Haladási sáv (percent, label)
    │
    ├── lib/
    │   ├── api.ts            # API wrapper — cookie-alapú auth, auto-refresh
    │   ├── config.ts         # Oldal konfiguráció (név, GitHub URL, Discord URL, Tudásbázis URL)
    │   └── types.ts          # TypeScript interfészek (User, Course, Module, stb.)
    │
    ├── pages/
    │   ├── HomePage.tsx       # Kezdőoldal
    │   ├── LoginPage.tsx      # Belépés (GitHub OAuth)
    │   ├── CoursesPage.tsx    # Kurzuslista
    │   ├── CourseDetailPage.tsx # Kurzus részletei
    │   ├── DashboardPage.tsx  # Dashboard (haladás, tanúsítványok)
    │   ├── VerifyPage.tsx     # Tanúsítvány publikus verifikáció
    │   └── admin/
    │       ├── AdminPage.tsx      # Admin dashboard (statisztikák)
    │       ├── AdminCoursesPage.tsx # Kurzusok kezelése (CRUD)
    │       └── AdminUsersPage.tsx  # Felhasználók kezelése
    │
    └── test/
        ├── setup.ts              # Teszt setup (@testing-library/jest-dom)
        ├── App.test.tsx          # Routing tesztek
        ├── components/           # Komponens tesztek
        ├── pages/                # Oldal tesztek
        └── lib/                  # Lib modul tesztek
```

---

## 3. Vite konfiguráció

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
    proxy: { '/api': 'http://localhost:8000' },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### Fontos tudnivalók

- **SPA (Single Page Application)** — a React Router kezeli az útvonalakat kliens oldalon
- **TypeScript strict mód** — minden fájl TypeScript-ben van írva (.tsx/.ts)
- **API proxy** — fejlesztés közben a Vite automatikusan a backend-re irányítja az `/api` kéréseket
- **Vitest beépítve** — a teszt konfiguráció a vite.config.ts-ben van

---

## 4. Útvonalak (React Router)

Az útvonalak az `App.tsx` fájlban vannak definiálva:

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/courses" element={<CoursesPage />} />
  <Route path="/courses/:id" element={<CourseDetailPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="/admin/courses" element={<AdminCoursesPage />} />
  <Route path="/admin/users" element={<AdminUsersPage />} />
  <Route path="/verify/:id" element={<VerifyPage />} />
</Routes>
```

Minden útvonal a `Layout` komponensbe van csomagolva, ami a header-t és footer-t biztosítja.

---

## 5. Layout és komponensek

### Layout (`Layout.tsx`)

A Layout komponens minden oldalon megjelenik:

- **Header** — logo, navigáció (Kurzusok, Dashboard), auth állapot
- **Footer** — copyright
- **Hamburger menü** — mobil nézetben

Az auth navigáció dinamikus: a komponens `useEffect`-tel lekérdezi a `/api/auth/me` végpontot cookie-alapú hitelesítéssel, és a válasz alapján jeleníti meg a navigációs elemeket. Admin felhasználóknál megjelenik az „Admin" link. Ha a felhasználó nincs bejelentkezve, a „Belépés" gomb jelenik meg.

```tsx
// Használat — automatikus az App.tsx-ben
<Layout>
  <Routes>...</Routes>
</Layout>
```

### Komponensek

| Komponens | Props | Használat |
|-----------|-------|-----------|
| `CourseCard` | `id: number`, `name: string`, `description: string \| null` | Kurzus kártya a listában |
| `ProgressBar` | `percent: number`, `label?: string` | Haladási sáv százalékkal |

---

## 6. Oldalak

### Publikus oldalak

| Oldal | Fájl | Leírás |
|-------|------|--------|
| Kezdőoldal | `HomePage.tsx` | Hero szekció, gyorsindítási útmutató, „Hogyan működik?" lépések, közösség szekció, kurzus előnézet |
| Kurzuslista | `CoursesPage.tsx` | Összes kurzus kártya nézetben |
| Kurzus részletek | `CourseDetailPage.tsx` | Modulok, feladatok, beiratkozás gomb, Classroom linkek |
| Belépés | `LoginPage.tsx` | GitHub OAuth gomb, cookie-alapú hitelesítés |
| Verifikáció | `VerifyPage.tsx` | Tanúsítvány publikus hitelesítés |

### Védett oldalak (bejelentkezés szükséges)

| Oldal | Fájl | Leírás |
|-------|------|--------|
| Dashboard | `DashboardPage.tsx` | Beiratkozott kurzusok, haladási sávok, tanúsítvány kezelés, GitHub sync |
| Admin dashboard | `admin/AdminPage.tsx` | Statisztikák (felhasználók, kurzusok, beiratkozások, stb.) |
| Admin felhasználók | `admin/AdminUsersPage.tsx` | Felhasználók táblázata, szerepkör módosítás |
| Admin kurzusok | `admin/AdminCoursesPage.tsx` | Kurzus CRUD, modul/feladat hozzáadás/törlés |

---

## 7. TypeScript típusok

A `lib/types.ts` fájl tartalmazza az összes interfészt:

```typescript
interface User { id: number; username: string; role: string; avatar_url?: string; }
interface Course { id: number; name: string; description: string | null; modules: Module[]; }
interface Module { id: number; name: string; order: number; exercises: Exercise[]; }
interface Exercise { id: number; name: string; order: number; required: boolean; classroom_url?: string; }
interface DashboardCourse { course_id: number; course_name: string; progress_percent: number; ... }
interface Certificate { id: number; cert_id: string; course_id: number; course_name: string; ... }
```

---

## 8. API kommunikáció

### `api.ts` — API wrapper

Az `apiFetch()` függvény kezeli az autentikációt cookie-alapon:

1. Cookie-kat küldi a kéréssel (`credentials: 'same-origin'`)
2. Ha a válasz `401`, megpróbálja frissíteni a tokent a `/api/auth/refresh` végponton
3. Ha a refresh is sikertelen, átirányít a `/login` oldalra

```typescript
import { apiFetch } from '../lib/api';

const res = await apiFetch('/api/me/dashboard');
const data = await res.json();
```

### Fejlesztés közben

A Vite dev szervere automatikusan proxy-zza a `/api` kéréseket a backend-re (port 8000). Docker Compose-zal futtatott környezetben az nginx a 80-as porton:
- `/api/*` → backend (FastAPI, port 8000)
- Minden más → frontend (Vite build)

---

## 9. Autentikáció

### Cookie-alapú hitelesítés

A frontend httpOnly cookie-kat használ az autentikációhoz. A tokenek közvetlenül nem hozzáférhetőek JavaScript-ből — a böngésző automatikusan küldi őket minden kéréssel.

```typescript
// API hívás hitelesítéssel
const res = await fetch('/api/auth/me', { credentials: 'same-origin' });

// Kijelentkezés
await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
```

### Védett oldalak

A védett oldalak (dashboard, admin) a `/api/auth/me` végponton ellenőrzik a hitelesítést, és szükség esetén átirányítanak a `/login` oldalra.

---

## 10. Stílusok (CSS)

### CSS változók (`global.css`)

```css
:root {
  --color-primary: #2c3e50;     /* Sötétkék — header, gombok */
  --color-accent: #e74c3c;      /* Piros — elsődleges gombok, kiemelés */
  --color-bg: #f8f9fa;          /* Világosszürke háttér */
  --color-text: #333;           /* Szöveges tartalom */
  --color-success: #27ae60;     /* Zöld — haladási sáv */
  --max-width: 1200px;          /* Tartalom maximális szélessége */
}
```

### Stílus konvenciók

- **Globális stílusok** — a `global.css`-t a `main.tsx` importálja
- **Nincs CSS framework** — vanilla CSS, CSS változókkal
- **Reszponzív** — `@media (max-width: 767px)` törésponttal

---

## 11. Tesztelés

A frontend Vitest + React Testing Library-t használ.

### Tesztek futtatása

```bash
npm test          # Vitest egyszer futtatás
npx vitest        # Watch módban
npx vitest --ui   # Böngészőben interaktív felület
```

### Teszt fájlok

A tesztek a `src/test/` mappában vannak:

| Fájl | Tesztel |
|------|---------|
| `App.test.tsx` | Útvonalak (routing) |
| `components/Layout.test.tsx` | Header, navigáció, auth állapot |
| `components/CourseCard.test.tsx` | Kurzus kártya megjelenítés |
| `components/ProgressBar.test.tsx` | Haladási sáv megjelenítés |
| `pages/HomePage.test.tsx` | Szekciók, kurzusok betöltése |
| `pages/LoginPage.test.tsx` | Login gomb |
| `pages/CoursesPage.test.tsx` | Kurzuslista betöltés |
| `pages/DashboardPage.test.tsx` | Dashboard megjelenítés |
| `pages/VerifyPage.test.tsx` | Tanúsítvány verifikáció |
| `lib/api.test.ts` | API wrapper, token refresh |
| `lib/config.test.ts` | Oldal konfiguráció |

### Teszt minta

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <MyComponent />
      </MemoryRouter>
    );
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

---

## 12. Admin panel

Az admin panel 3 oldalból áll, mindegyik kliens oldalon ellenőrzi az admin szerepkört.

### Admin — Áttekintés (`AdminPage.tsx`)

- Statisztikák: felhasználók, kurzusok, beiratkozások, tanúsítványok, feladatok
- API: `GET /api/admin/stats`

### Admin — Felhasználók (`AdminUsersPage.tsx`)

- Táblázat: avatar, felhasználónév, email, szerepkör, regisztráció, utolsó belépés
- Szerepkör módosítás: `<select>` dropdown → „Mentés" gomb
- API: `GET /api/admin/users`, `PATCH /api/admin/users/{id}/role`

### Admin — Kurzusok (`AdminCoursesPage.tsx`)

- **Kurzus létrehozása** — űrlap (név, leírás) → `POST /api/courses`
- **Kurzus törlése** — megerősítés ablak → `DELETE /api/admin/courses/{id}`
- **Részletek lenyitása** — modulok és feladatok betöltése → `GET /api/courses/{id}`
- **Modul hozzáadása** — űrlap (név, sorrend) → `POST /api/courses/{id}/modules`
- **Modul törlése** → `DELETE /api/admin/modules/{id}`
- **Feladat hozzáadása** — űrlap (név, repo prefix, classroom URL, sorrend) → `POST /api/courses/{id}/modules/{mid}/exercises`
- **Feladat törlése** → `DELETE /api/admin/exercises/{id}`

---

## 13. Új oldal hozzáadása (lépésről lépésre)

### Új oldal (komponens)

1. Hozz létre egy új `.tsx` fájlt a `src/pages/` mappában:

```tsx
export default function AboutPage() {
  return (
    <div className="container page">
      <h1>Rólunk</h1>
      <p>Tartalom...</p>
    </div>
  );
}
```

2. Add hozzá az útvonalat az `App.tsx`-ben:

```tsx
import AboutPage from './pages/AboutPage';

<Route path="/about" element={<AboutPage />} />
```

### Védett oldal

A védett oldalak a `useEffect`-ben ellenőrzik a hitelesítést:

```tsx
useEffect(() => {
  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then((r) => { if (!r.ok) window.location.href = '/login'; })
    .catch(() => { window.location.href = '/login'; });
}, []);
```

---

## 14. Docker integráció

A frontend a Docker Compose-ban build konténerként fut:

```yaml
frontend:
  build: ./frontend
  volumes:
    - frontend_dist:/usr/share/nginx/html
```

A `frontend/Dockerfile` telepíti a csomagokat és futtatja a `npm run build`-et. Az nginx a generált fájlokat szolgálja ki a megosztott volume-ból, SPA fallback-kel (`try_files $uri $uri/ /index.html`).

### Újraépítés fejlesztés közben

```bash
# Csak a frontend újraépítése
docker compose up -d --build frontend

# Vagy a teljes stack
make up
```

---

## 15. Hibaelhárítás

### Hot reload nem működik

- Ellenőrizd, hogy a helyes mappában vagy-e: `cd frontend`
- Port ütközés: `npx vite --port 4322`

### Stílusok nem töltődnek be

- Ellenőrizd, hogy a `main.tsx` importálja a `global.css`-t
- Docker build után: `docker compose up -d --build frontend`

### TypeScript hibák

```bash
npx tsc --noEmit    # Típushibák listázása
```

### ESLint / Prettier hibák

```bash
npm run lint          # ESLint hibák listázása
npm run lint:fix      # Automatikus javítás
npm run format        # Prettier formázás alkalmazása
```

### API hívások nem működnek

- Lokális fejlesztésnél a Vite proxy-t használ (`vite.config.ts` → `server.proxy`)
- Docker-ben az nginx proxy-zza a `/api` kéréseket
- Ellenőrizd: `curl http://localhost:8000/health`
