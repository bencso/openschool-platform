# DevSchool Platform

Online tanulási platform, amely kurzusokat kínál, követi a diákok haladását, és tanúsítványt állít ki.

## Tech Stack

- **Backend:** FastAPI + SQLAlchemy + Alembic
- **Adatbázis:** PostgreSQL
- **Frontend:** Astro (statikus oldal generátor)
- **Infrastruktúra:** Docker Compose, nginx, GitHub Actions

## Gyors indítás

### Előfeltételek

- Docker és Docker Compose
- Python 3.12+ (lokális fejlesztéshez)

### Futtatás Docker-rel

```bash
# .env fájl létrehozása
cp .env.example .env

# Indítás
docker compose up --build -d

# Ellenőrzés
curl http://localhost:8000/health
```

### Lokális fejlesztés

```bash
# Virtuális környezet
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Tesztek futtatása
pytest -v

# Linter
ruff check . && ruff format --check .
```

### Makefile parancsok

```bash
make up       # Docker Compose indítás
make down     # Docker Compose leállítás
make test     # Tesztek futtatása
make migrate  # Alembic migrációk futtatása
make lint     # Ruff linter és formatter ellenőrzés
```

## Projekt struktúra

```
devschool-platform/
├── docker-compose.yml
├── .env.example
├── .github/workflows/ci.yml
├── Makefile
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   └── routers/
│   └── tests/
├── frontend/
└── nginx/
```

## API Endpoints

| Endpoint | Metódus | Leírás |
|----------|---------|--------|
| `/health` | GET | Health check |

## Licensz

MIT
