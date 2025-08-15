// Gallery.js

function toggleZoom(img, event) {
  img.classList.toggle("zoomed");
  if (img.classList.contains("zoomed")) zoomInTransform(img, event);
  else img.style.transform = "";
}

function zoomInTransform(img, event) {
  const fullsizeScale = fullResolutionScale(img);
  const { originX, originY } = relativeMousePosition();

  console.log(`scale=${fullsizeScale} origin=${originX}, ${originY}`);

  img.style.transformOrigin = `${originX}px ${originY}px`;
  img.style.transform = `scale(${fullsizeScale})`;

  function relativeMousePosition() {
    const rect = img.getBoundingClientRect();
    const originX = event.clientX - rect.left;
    const originY = event.clientY - rect.top;
    return { originX, originY };
  }
}

function fullResolutionScale(img) {
  if (!(img instanceof HTMLImageElement)) throw new Error("Element must be an HTMLImageElement");
  if (!img.complete || img.naturalWidth === 0) throw new Error("Image not loaded yet");
  if (img.clientWidth === 0 || img.clientHeight === 0) throw new Error("Image has zero display size");

  const scaleX = img.naturalWidth / img.clientWidth;
  const scaleY = img.naturalHeight / img.clientHeight;
  return Math.max(scaleX, scaleY);
}

document.addEventListener("keydown", (e) => {
  if (window.location.pathname !== "/gallery") return;
  if (e.key === "Escape") document.getElementById("modal").classList.remove("currently-viewed");
});

document.addEventListener("htmx:beforeSwap", (evt) => {
  if (evt.target.id === "modal-content") {
    evt.target.querySelectorAll("img").forEach((img) => (img.src = ""));
  }
});
