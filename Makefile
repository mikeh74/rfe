SHELL := /bin/sh

JEKYLL := bundle exec jekyll

.PHONY: build serve install clean

build:
	$(JEKYLL) build

serve:
	$(JEKYLL) serve --livereload

install:
	bundle install

clean:
	$(JEKYLL) clean
