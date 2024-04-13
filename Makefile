.DEFAULT_GOAL := build

deps:
	yarn
.PHONY: deps

build: deps
	yarn build
.PHONY: build
