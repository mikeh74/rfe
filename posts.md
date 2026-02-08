---
layout: default
title: Posts
permalink: /posts/
---

# Posts

{% if site.posts.size > 0 %}
  {% if site.tags.size > 0 %}
  <div class="tag-filter" data-post-filter>
    <button class="tag-button is-active" type="button" data-tag="all">All</button>
    {% for tag in site.tags %}
      <button class="tag-button" type="button" data-tag="{{ tag[0] | slugify }}">{{ tag[0] }}</button>
    {% endfor %}
  </div>
  {% endif %}

  <div class="post-index">
    {% for post in site.posts %}
      {% capture tag_slugs %}{% for tag in post.tags %}{{ tag | slugify }} {% endfor %}{% endcapture %}
      <article class="post-card" data-post-item data-tags="{{ tag_slugs | strip }}">
        <div class="post-meta">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
        </div>
        {% if post.tags.size > 0 %}
          <ul class="post-tags">
            {% for tag in post.tags %}
              <li>{{ tag }}</li>
            {% endfor %}
          </ul>
        {% endif %}
      </article>
    {% endfor %}
  </div>

  <p class="no-posts" data-no-posts hidden>No posts match that tag yet.</p>
{% else %}
  <p>No posts yet.</p>
{% endif %}
