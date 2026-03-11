# Changelog

Az OpenSchool Platform változásainak naplója.

A formátum a [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) alapján készült.

## [Unreleased]

### Added
- **Pagination** — `GET /api/courses` és `GET /api/admin/users` lapozható (`skip`, `limit` paraméterek), `{total, data}` válaszformátum
- **Sorting** — `GET /api/admin/users` rendezési paraméterek (`sort_by`, `sort_order`)
- **Mermaid diagramok** — architektúra dokumentáció vizuális diagramokkal (rendszer áttekintés, OAuth flow, ER diagram, CI/CD pipeline)
- **Tartalomjegyzék** — GitHub Classroom integráció dokumentáció
- **CHANGELOG.md** — változásnapló
- **CSS `.progress-wrapper`** — globális flex wrapper stílus haladási sávokhoz
- **Frontend JS modulok** — `dashboard.js`, `course-detail.js` külön fájlok

### Changed
- **Frontend JS kiemelés** — Dashboard és kurzus részletek inline `<script>` tartalma külön JS fájlokba kiemelve (`src/lib/dashboard.js`, `src/lib/course-detail.js`)
- **CSS deduplikáció** — Dashboard haladási sávok inline stílusai lecserélve globális CSS osztályokra (`.progress-bar`, `.progress-bar-fill`)
- **Frontend pagináció** — index, kurzuslista, admin kurzusok, admin felhasználók oldalak frissítve az új `{total, data}` válaszformátumhoz
- **Type hints** — `update_progress_for_user()` visszatérési típus hozzáadva (`-> None`)

## [e7e3ea0] - Refaktor I.

### Changed
- **Teszt fixture-ök** — duplikált fixture-ök összevonva `conftest.py`-ba (~200 sor törölve)
- **Progress service** — `count_progress()` kiemelve `services/progress.py`-ba
- **N+1 query** — `joinedload(Enrollment.user)` hozzáadva `course_students` endpointhoz
- **Webhook hibakezelés** — try/except + rollback a webhook commit-nál
- **Logging** — naplózás hozzáadva certificate, pdf, qr, github service-ekhez
- **Hibaüzenetek** — angol nyelvre egységesítve
- **`.env.example`** — dokumentálva az összes konfigurációs változó
- **Footer** — dinamikus év `new Date().getFullYear()`-ral

## [03c7bce] - Staging környezet

### Added
- Staging deploy részletes útmutató a telepítési dokumentációban (8 alfejezet)
- `staging-deploy` job a CD pipeline-ban (develop ág → staging szerver)

## [5810027] - Karbantartás

### Added
- `docs/karbantartas-utmutato.md` — 9 szekciós karbantartási útmutató
- `.github/dependabot.yml` — pip heti, github-actions havi frissítések
- Navigációs sáv minden dokumentumban frissítve

## [372d8d0] - CI/CD frissítés

### Changed
- GitHub Actions `actions/checkout@v5`, `actions/setup-python@v6` (Node.js 24 kompatibilis)

## [0f0f490] - Lint javítások

### Fixed
- 11 ruff lint hiba javítva (üres except, f-string, felesleges import)

## [331976a] - Függőségek

### Changed
- 12 pinned verzió frissítve a ténylegesen telepített verziókra
- `ruff` hozzáadva dev függőségként

## [5053949] - Biztonsági hardening

### Added
- CORS konfiguráció (`.env`-ből olvasott origin lista)
- Token fragment alapú autentikáció (`/login#token=...`)
- `/api/auth/refresh` endpoint (httpOnly cookie)
- Globális exception handler naplózással
- Strukturált logging (environment-függő szint)
- nginx biztonsági headerek (X-Frame-Options, CSP, stb.)
- CI lint lépés (ruff)
- CD teszt kapu (tesztek futnak deploy előtt)

### Changed
- Dockerfile `--reload` flag eltávolítva produkcióban
