.DEFAULT_GOAL := run

lint:
	@exit 1

debug:
	@npm run debug

run:
	@npm run develop

serve:
	@npm run start

build:
	@npm run build
