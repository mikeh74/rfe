---
layout: default
title: "Django Images for testing"
tags: [Django, Python]
---

# Images for testing

Writing tests which involve images can problematic as you will need to store
images in your project just for testing. This solution shows how you can
create an image to be used just while testing.

## Problem

You need to create an uploaded image for testing.

## Solution

Use SimpleUploadedFile and populate it with a temp image.

```python

# Articles:
# https://stackoverflow.com/questions/26298821/django-testing-model-with-imagefield
# https://stackoverflow.com/questions/8611651/generate-in-memory-image-for-django-testing/22824942
# https://swapps.com/blog/testing-files-with-pythondjango/

from django.core.files.uploadedfile import SimpleUploadedFile

small_gif = (
    b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
    b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
    b'\x02\x4c\x01\x00\x3b'
)
uploaded = SimpleUploadedFile('small.gif', small_gif, content_type='image/gif')

```
