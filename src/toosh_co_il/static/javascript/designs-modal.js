document.addEventListener("click", (event) => {
  const target = event.target.closest("#designs-grid .bg-svg");
  if (target === null) return;  // Not on designs page

  const imageGrid = document.getElementById("designs-grid");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");

  console.log("click");
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
