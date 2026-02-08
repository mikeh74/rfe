---
layout: default
title: "Home"
banner_image: /assets/images/IMG_8365.jpg
banner_title: Radio Free Europe
banner_tagline: Yet another developer blog site.
---

## Latest Posts

{% if site.posts.size > 0 %}
  <div class="featured-posts">
  {% for post in site.posts limit: 5 %}
  <article class="featured-post">
  <h3>
  <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </h3>
  <p class="post-tease">
  {{ post.excerpt | strip_html | truncatewords: 28 }}
  </p>
  <a class="read-more" href="{{ post.url | relative_url }}">Read more</a>
  </article>
  {% endfor %}
  </div>
  {% else %}
  <p>No posts yet.</p>
{% endif %}
