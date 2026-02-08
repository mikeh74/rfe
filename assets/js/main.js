function applyBackgroundImages() {
  const nodes = document.querySelectorAll("[data-bg-image]");

  nodes.forEach((node) => {
    const src = node.getAttribute("data-bg-image");

    if (src) {
      node.style.backgroundImage = `url("${src}")`;
    }
  });
}

function setupPostFilters() {
  const filter = document.querySelector("[data-post-filter]");
  const posts = Array.from(document.querySelectorAll("[data-post-item]"));
  const emptyState = document.querySelector("[data-no-posts]");

  if (!filter || posts.length === 0) {
    return;
  }

  const buttons = Array.from(filter.querySelectorAll("[data-tag]"));

  const applyFilter = (tag) => {
    let visibleCount = 0;

    posts.forEach((post) => {
      const tags = (post.getAttribute("data-tags") || "")
        .split(" ")
        .filter(Boolean);
      const matches = tag === "all" || tags.includes(tag);
      post.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilter(button.dataset.tag || "all");
    });
  });
}

function initializePage() {
  applyBackgroundImages();
  setupPostFilters();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}


