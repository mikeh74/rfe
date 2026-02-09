(function() {
  var searchInput = document.getElementById('search-input');
  var resultsContainer = document.getElementById('results-container');
  var searchIndex;
  var searchData;

  // Load search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
      
      // Build Lunr index
      searchIndex = lunr(function() {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('tags', { boost: 5 });
        this.field('categories', { boost: 5 });
        this.field('content');

        data.forEach(function(doc) {
          this.add(doc);
        }, this);
      });
    })
    .catch(error => {
      console.error('Error loading search data:', error);
      resultsContainer.innerHTML = '<p>Error loading search functionality.</p>';
    });

  // Perform search
  function performSearch(query) {
    if (!searchIndex || query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }

    try {
      var results = searchIndex.search(query);
      
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
      }

      var html = '';
      results.forEach(function(result) {
        var item = searchData.find(function(post) {
          return post.id === result.ref;
        });

        if (item) {
          var preview = item.content.substring(0, 200) + '...';

          html += '<article class="search-result">';
          html += '<h3><a href="' + item.url + '">' + item.title + '</a></h3>';
          html += '<div class="search-result-date">' + item.date + '</div>';
          html += '<div class="search-result-preview">' + preview + '</div>';
          html += '</article>';
        }
      });

      resultsContainer.innerHTML = html;
    } catch (error) {
      console.error('Search error:', error);
      resultsContainer.innerHTML = '<p>Error performing search.</p>';
    }
  }

  // Debounce function to avoid excessive searches
  var debounceTimer;
  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      performSearch(searchInput.value);
    }, 300);
  });
})();
