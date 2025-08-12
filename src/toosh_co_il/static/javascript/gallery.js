// Gallery.js

document.addEventListener("keydown", (e) => {
  if (window.location.pathname !== "/gallery") return;
  if (e.key === "Escape") document.getElementById("modal").classList.remove("currently-viewed");
});

document.addEventListener("htmx:beforeSwap", (evt) => {
  if (evt.target.id === "modal-content") {
    evt.target.querySelectorAll("img").forEach((img) => (img.src = ""));
  }
});
