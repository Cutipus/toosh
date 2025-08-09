// designs-modal.js
let modalState = "closed"; // possible values: "closed", "opening", "open", "closing"
const preloadCache = {};
let preloadTimer = null;
let lastModalAction = 0; // cooldown tracker for triple-click
let cleanupHandler = null;

function preloadImage(projectName, width, height) {
  if (preloadCache[projectName]) return;
  const img = new Image();
  img.src = `/static/projects/${projectName}/fullsize.webp`;
  img.width = width;
  img.height = height;
  preloadCache[projectName] = img;
}

function openModal(projectName, width, height) {
  // Cancel any pending close cleanups
  if (cleanupHandler) {
    document.getElementById("modal").removeEventListener("transitionend", cleanupHandler);
    cleanupHandler = null;
  }

  if (modalState === "opening" || modalState === "open") return;
  modalState = "opening";
  lastModalAction = performance.now();

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  modal.classList.remove("hidden");
  modal.classList.add("flex", "currently-viewed");

  modalImage.src = `/static/projects/${projectName}/preview.webp`;
  modalImage.style.aspectRatio = `${width} / ${height}`;
  modalImage.classList.remove("opacity-0");

  const fullImg = preloadCache[projectName] || new Image();
  fullImg.src = `/static/projects/${projectName}/fullsize.webp`;
  fullImg
    .decode()
    .catch(() => {})
    .finally(() => {
      modalImage.src = fullImg.src;
      modalState = "open";
    });
}

function hideModal() {
  const now = performance.now();
  if (now - lastModalAction < 300) return;
  if (modalState === "closing" || modalState === "closed") return;
  modalState = "closing";
  lastModalAction = now;

  const modal = document.getElementById("modal");
  if (!modal.classList.contains("currently-viewed")) {
    modalState = "closed";
    return;
  }

  modal.classList.remove("currently-viewed");

  cleanupHandler = (e) => {
    if (e.target !== modal) return;
    document.getElementById("modal-image").classList.remove("zoomed");
    modal.classList.add("hidden");
    modal.removeEventListener("transitionend", cleanupHandler);
    cleanupHandler = null;
    modalState = "closed";
  };

  modal.addEventListener("transitionend", cleanupHandler);
}

// ---------------- Bind Events ----------------
document.addEventListener("DOMContentLoaded", () => {
  const gridImages = document.querySelectorAll("#designs-grid img");

  // Fade-in previews when loaded
  gridImages.forEach((img) => {
    if (img.complete) {
      img.classList.remove("opacity-0");
      img.dataset.ready = "true";
    } else {
      img.addEventListener("load", () => {
        img.classList.remove("opacity-0");
        img.dataset.ready = "true";
      });
    }
  });

  // Hover delay for desktop
  document.addEventListener("mouseover", (e) => {
    const img = e.target.closest("#designs-grid img");
    if (!img || img.dataset.ready !== "true") return;
    preloadTimer = setTimeout(() => {
      const container = img.closest("[data-project-name]");
      preloadImage(container.dataset.projectName, container.dataset.sizeWidth, container.dataset.sizeHeight);
    }, 200);
  });

  document.addEventListener("mouseout", () => {
    if (preloadTimer) {
      clearTimeout(preloadTimer);
      preloadTimer = null;
    }
  });

  // Click image → open modal
  document.addEventListener("click", (e) => {
    const img = e.target.closest("#designs-grid img");
    if (!img) return;
    const container = img.closest("[data-project-name]");
    openModal(container.dataset.projectName, container.dataset.sizeWidth, container.dataset.sizeHeight);
  });

  // Click underlay → close
  document.getElementById("modal-underlay").addEventListener("click", hideModal);

  // Escape key → close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });

  // Toggle zoom in modal
  document.getElementById("modal-image").addEventListener("click", (e) => {
    e.target.classList.toggle("zoomed");
  });

  // Mobile: preload when near viewport
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.dataset.ready === "true") {
          const container = entry.target.closest("[data-project-name]");
          preloadImage(container.dataset.projectName, container.dataset.sizeWidth, container.dataset.sizeHeight);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "200px" },
  );

  gridImages.forEach((img) => observer.observe(img));

  // Idle preloading for the rest of the gallery
  const startIdlePreload = () => {
    if (typeof requestIdleCallback !== "function") return;
    requestIdleCallback(() => {
      gridImages.forEach((img) => {
        const container = img.closest("[data-project-name]");
        if (container && img.dataset.ready === "true") {
          preloadImage(container.dataset.projectName, container.dataset.sizeWidth, container.dataset.sizeHeight);
        }
      });
    });
  };

  // Trigger idle preload after first hover/click preload
  document.addEventListener("mouseover", function onceHover(e) {
    const img = e.target.closest("#designs-grid img");
    if (!img) return;
    startIdlePreload();
    document.removeEventListener("mouseover", onceHover);
  });

  document.addEventListener("click", function onceClick(e) {
    const img = e.target.closest("#designs-grid img");
    if (!img) return;
    startIdlePreload();
    document.removeEventListener("click", onceClick);
  });
});
