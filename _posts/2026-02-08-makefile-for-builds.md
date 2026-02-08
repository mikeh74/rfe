---
layout: default
title: "Makefile for builds"
---

# Using makefile for builds and project workflows

Make is an old tool that still fits modern projects. It gives you a single
place to define commands for common tasks and a familiar way to describe
dependencies between steps. For Python projects, it can act as a thin wrapper
around your tooling while keeping everything discoverable and repeatable.

## Why use a Makefile?

- One command for common tasks like `make dev`, `make test`, or `make format`.
- A consistent interface for team members and CI.
- A single pipeline that can chain Python, Sass, JavaScript, and more.

Make does not replace your tools. It just makes them easier to run in a
reliable order.

## A simple Python workflow

Here is a small Makefile that covers a typical Python app:

```makefile
.PHONY: help dev test lint format clean

help:
	@echo "Targets: dev, test, lint, format, clean"

dev:
	python -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt
	. .venv/bin/activate && python -m app

test:
	. .venv/bin/activate && pytest -q

lint:
	. .venv/bin/activate && ruff check .

format:
	. .venv/bin/activate && ruff format .

clean:
	rm -rf .venv __pycache__ .pytest_cache
```

This keeps the commands short and lets you standardize the workflow across
local development and CI. You can extend the same idea for migrations, seed
data, or generating docs.

## Containers and infrastructure

Make is also useful for container workflows. You can define a few consistent
targets and hide the long commands:

```makefile
.PHONY: docker-build docker-run docker-stop

docker-build:
	docker build -t myapp:dev .

docker-run:
	docker run --rm -p 8000:8000 myapp:dev

docker-stop:
	docker ps -q --filter "ancestor=myapp:dev" | xargs -r docker stop
```

If you use Compose, swap those targets to `docker compose up` and
`docker compose down`. The Makefile is still the entry point.

## A unified build pipeline

Projects often involve multiple technologies. A Makefile can roll them into a
single pipeline while keeping each tool in place. For example:

```makefile
.PHONY: assets css js build

css:
	sass assets/scss:assets/css --style=compressed

js:
	npm run build

assets: css js

build: assets
	jekyll build
```

Now `make build` runs Sass, JavaScript, and the static site build in the right
order. CI can call the same target, so there is one source of truth for the
pipeline.

## Removing reliance on extra glue tools

Make is not a replacement for modern tooling, but it can replace the glue that
ties everything together. You get:

- Clear entry points for tasks.
- A portable, dependency-aware build graph.
- Fewer ad-hoc scripts scattered across the repo.

When you want one command to orchestrate Python, containers, and asset builds,
Make is still a strong option.
