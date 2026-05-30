.PHONY: install dev build preview deploy lint

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

preview:
	npm run build && npx vite preview

deploy:
	npm run deploy

lint:
	npm run lint
