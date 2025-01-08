.PHONY: ext lint
.DEFAULT_GOAL := ext

lint:
	web-ext lint --ignore-files=Makefile --ignore-files="*~"

ext: lint
	web-ext sign --api-key="$(JWT_ISSUER)" --api-secret="$(JWT_SECRET)" --channel="unlisted" --ignore-files=Makefile --ignore-files="*~" -a ../build
