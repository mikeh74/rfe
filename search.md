---
layout: default
title: Search
permalink: /search/
---

<div class="search-container">
  <input type="text" id="search-input" placeholder="Search posts..." autocomplete="off">
  <div id="results-container"></div>
</div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script src="{{ '/assets/js/search.js' | relative_url }}"></script>
