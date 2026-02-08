---
layout: default
title: Posts
permalink: /posts/
---

# Posts

{% if site.posts.size > 0 %}
  <div>
  {% for post in site.posts %}
    <article>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    </article>
  {% endfor %}
  </div>
{% else %}
  <p>No posts yet.</p>
{% endif %}
