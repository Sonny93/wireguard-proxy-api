webapp_path := "apps/webapp"

dev:
	@docker compose --env-file apps/webapp/.env down
	@cd {{ webapp_path }} && node ace migration:fresh --seed
	@pnpm run dev:webapp

prod:
	@docker compose pull
	@docker compose up -d --build --wait

seed:
	@cd {{ webapp_path }} && node ace db:seed

down:
	@-docker compose down

release:
	@npx release-it

format:
	@pnpm run format
