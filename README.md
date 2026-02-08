# Jekyll Starter

A minimal Jekyll scaffold.

## Requirements

- Ruby (2.7+ recommended)
- Bundler (`gem install bundler`)
- Node.js (18+ recommended)

## Setup

```bash
bundle install
npm install
```

Or:

```bash
make install
```

## Run

```bash
bundle exec jekyll serve --livereload
```

In another terminal, watch Sass:

```bash
npm run watch:css
```

Or:

```bash
make serve
```

Visit http://localhost:4000

## Build

```bash
make
```

This outputs the site to `_site/`.

## Cloudflare Pages

Use these settings in the Cloudflare Pages build configuration:

- Build command: `npm ci && bundle install && make build`
- Output directory: `_site`

If you prefer not to use Make, this is the equivalent build command:

```bash
npm ci && npm run build:css && bundle exec jekyll build
```

## Clean

```bash
make clean
```
