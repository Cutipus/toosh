// Gallery.js

document.addEventListener("keydown", (e) => {
  if (window.location.pathname !== "/gallery") return;
  if (e.key === "Escape") document.getElementById("modal").classList.remove("currently-viewed");
});
