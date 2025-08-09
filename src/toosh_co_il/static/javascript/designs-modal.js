// designs-modal.js
const fullsizeQueue = new ImageQueue();
let modalState = "closed"; // possible values: "closed", "opening", "open", "closing"
const preloadCache = {};
let preloadTimer = null;
let lastModalAction = 0; // cooldown tracker for triple-click
let cleanupHandler = null;

function preloadImage(projectName, width, height) {
  const url = `/static/projects/${projectName}/fullsize.webp`;
  fullsizeQueue.add(url);
}

async function openModal(projectName, width, height) {
  // cancel pending cleanup...
  if (cleanupHandler) {
    document.getElementById("modal").removeEventListener("transitionend", cleanupHandler);
    cleanupHandler = null;
  }

  if (modalState === "opening" || modalState === "open") return;
  modalState = "opening";
  lastModalAction = performance.now();

  const url = `/static/projects/${projectName}/fullsize.webp`;
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  modal.classList.remove("hidden");
  modal.classList.add("flex", "currently-viewed");
  modalImage.style.aspectRatio = `${width} / ${height}`;
  modalImage.classList.add("loading");

  // Prioritize this URL and start a single fetch immediately
  const promise = fullsizeQueue.addToFront(url);
  await fullsizeQueue.startOnce(); // process the front-of-queue item right now

  try {
    await promise; // resolves when that URL is loaded (or rejects)
    modalImage.src = url;
  } catch (err) {
    console.error("Failed to load fullsize:", err);
    // optionally fallback to preview by setting modalImage.src = `/static/.../preview.webp`
  }

  modalImage.classList.remove("loading");
  modalState = "open";
}

function hideModal() {
  const now = performance.now();
  if (now - lastModalAction < 300) return;
  if (modalState === "closing" || modalState === "closed") return;
  modalState = "closing";
  lastModalAction = now;

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  if (!modal.classList.contains("currently-viewed")) {
    modalState = "closed";
    return;
  }

  modal.classList.remove("currently-viewed");

  cleanupHandler = (e) => {
    if (e.target !== modal) return;
    document.getElementById("modal-image").classList.remove("zoomed");
    modal.classList.add("hidden");
    modalImage.src = "";
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

  // Hover delay for desktop (queued, but doesn't start until previews loaded)
  document.addEventListener("mouseover", (e) => {
    const img = e.target.closest("#designs-grid img");
    if (!img || img.dataset.ready !== "true") return;
    const container = img.closest("[data-project-name]");
    fullsizeQueue.addToFront(`/static/projects/${container.dataset.projectName}/fullsize.webp`);
  });

  document.addEventListener("mouseout", () => {
    if (preloadTimer) {
      clearTimeout(preloadTimer);
      preloadTimer = null;
    }
  });

  // Click image → open modal (immediate load, bypass preview wait)
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
          fullsizeQueue.addToFront(`/static/projects/${container.dataset.projectName}/fullsize.webp`);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "200px" },
  );

  gridImages.forEach((img) => observer.observe(img));

  // Load all previews first, then start queued fullsize loads
  Promise.all(
    Array.from(gridImages).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => img.addEventListener("load", resolve));
    }),
  ).then(() => {
    fullsizeQueue.start();
  });
});
