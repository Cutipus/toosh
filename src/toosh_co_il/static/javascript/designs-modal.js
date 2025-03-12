document.addEventListener("click", (event) => {
  const target = event.target.closest("#designs-grid .bg-svg");
  if (target === null) return; // didn't click on designs

  event.stopImmediatePropagation(); // don't trigger the second event

  const imageGrid = document.getElementById("designs-grid");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  imageGrid.classList.add("hidden");
  modal.classList.remove("hidden");

  const projectName = target.dataset.projectName;
  const sizeWidth = target.dataset.sizeWidth;
  const sizeHeight = target.dataset.sizeHeight;
  const fullsizeImageUrl = `/static/projects/${projectName}/fullsize.webp`;
  modalImage.src = fullsizeImageUrl;
  modalImage.alt = projectName;
  modalImage.style.aspectRatio = `${sizeWidth} / ${sizeHeight}`;
});

document.addEventListener("click", (event) => {
  const modal = document.getElementById("modal");
  const imageGrid = document.getElementById("designs-grid");

  if (modal === null) return; // not on designs page
  if (modal.classList.contains("hidden")) return; // modal not visible
  const target = event.target.closest("#modal-image");
  if (target !== null) return; // clicking on image doesn't do anything

  imageGrid.classList.remove("hidden");
  modal.classList.add("hidden");
});
