let timer = null;

document.addEventListener("keydown", ({ key }) => {
  if (key === "Escape") hideModal();
});

function hideModal() {
  document.getElementById("modal").classList.remove("currently-viewed");
  setTimeout(() => document.getElementById("modal-image").classList.remove("zoomed"), 500);
}

function loadModalImage(image) {
  timer = setTimeout(() => {
    const modalImage = document.getElementById("modal-image");
    modalImage.src = image.src.replace("preview", "fullsize");
    modalImage.alt = image.alt;
    modalImage.style.aspectRatio = image.dataset.sizeWidth + "/" + image.dataset.sizeHeight;
  }, 200);
}

function unloadModalImage(image) {
  timer && clearTimeout(timer);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("#designs-grid .bg-svg");
  if (target === null) return; // didn't click on designs
  event.stopImmediatePropagation(); // don't trigger the second event

  // show modal
  loadModalImage(target.querySelector("img"));
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex", "currently-viewed");
});
