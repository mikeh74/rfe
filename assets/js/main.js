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

function setupMobileNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  const overlay = document.querySelector("[data-mobile-overlay]");
  const closeButton = document.querySelector("[data-menu-close]");

  if (!toggle || !panel || !overlay || !closeButton) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 700px)");
  let previouslyFocused = null;

  const closeMenu = (restoreFocus) => {
    document.body.classList.remove("is-mobile-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    panel.setAttribute("aria-hidden", "true");

    if (restoreFocus && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
  };

  const openMenu = () => {
    if (!mobileQuery.matches) {
      return;
    }

    previouslyFocused = document.activeElement;
    document.body.classList.add("is-mobile-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    panel.setAttribute("aria-hidden", "false");

    const firstLink = panel.querySelector("a");
    if (firstLink instanceof HTMLElement) {
      firstLink.focus();
    }
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("is-mobile-nav-open");

    if (isOpen) {
      closeMenu(true);
    } else {
      openMenu();
    }
  });

  closeButton.addEventListener("click", () => {
    closeMenu(true);
  });

  overlay.addEventListener("click", () => {
    closeMenu(false);
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-mobile-nav-open")) {
      closeMenu(true);
    }
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMenu(false);
    }
  });

  closeMenu(false);
}

function setupStickyHeaderState() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeaderState = () => {
    const shouldShrink = window.scrollY > 12;
    header.classList.toggle("is-scrolled", shouldShrink);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

function initializePage() {
  applyBackgroundImages();
  setupPostFilters();
  setupMobileNavigation();
  setupStickyHeaderState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
