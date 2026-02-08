SHELL := /bin/sh

JEKYLL := bundle exec jekyll
NPM := npm

.PHONY: build build-css serve install clean

build: build-css
	$(JEKYLL) build

build-css:
	$(NPM) run build:css

serve: build-css
	$(JEKYLL) serve --livereload

install:
	bundle install
	$(NPM) install

clean:
	$(JEKYLL) clean
