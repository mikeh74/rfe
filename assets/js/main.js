function applyBackgroundImages() {
  const nodes = document.querySelectorAll("[data-bg-image]");

  nodes.forEach((node) => {
    const src = node.getAttribute("data-bg-image");

    if (src) {
      node.style.backgroundImage = `url("${src}")`;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyBackgroundImages);
} else {
  applyBackgroundImages();
}


