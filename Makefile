.PHONY: up down test migrate lint

up:
	docker compose up --build -d

down:
	docker compose down

test:
	cd backend && pytest -v

migrate:
	cd backend && alembic upgrade head

lint:
	cd backend && ruff check . && ruff format --check .
