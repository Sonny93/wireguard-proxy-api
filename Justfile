webapp_path := "apps/webapp"

dev:
	@docker compose -f compose.yml --env-file apps/webapp/.env down
	@docker compose -f dev.compose.yml --env-file apps/webapp/.env pull
	@docker compose -f dev.compose.yml --env-file apps/webapp/.env up -d --wait
	@cd {{ webapp_path }} && node ace migration:fresh --seed
	@pnpm run dev:webapp

prod:
	@docker compose -f dev.compose.yml down
	@docker compose pull
	@docker compose up -d --build --wait

seed:
	@cd {{ webapp_path }} && node ace db:seed

down:
	@-docker compose down
	@-docker compose -f dev.compose.yml down

release:
	@npx release-it

format:
	@pnpm run format
