---
layout: default
title: "Using htaccess for caching"
tags: [Apache]
---

# Using htaccess for Caching

## Problem

You want to use Apache to instruct browsers to cache static assets to improve
website performance.

## Solution

The htaccess file can be used to control browser caching behaviour. Here is an
example htaccess file with some general defaults to use as a starting point:

```apache
# General htaccess for caching media and static resources
Require all granted

# Don't show directory listings for URLs which map to a directory.
Options -Indexes

# Follow symbolic links in this directory.
Options +FollowSymLinks

# BROWSER CACHING USING CACHE-CONTROL HEADERS
<IfModule mod_headers.c>
    # One year for image and video files
    <FilesMatch ".(flv|gif|ico|jpg|jpeg|mp4|mpeg|png|svg|swf|webp)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>

    # One year for JavaScript, CSS, PDF, and fonts
    <FilesMatch ".(js|mjs|css|pdf|woff|woff2|ttf)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>

    # X-Content-Type nosniff
    Header set X-Content-Type-Options nosniff
</IfModule>
```

## Resources

See the MDN docs for [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) for further info.
