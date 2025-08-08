document.addEventListener("keydown", ({ key }) => {
  if (key === "Escape") document.getElementById("modal").classList.remove("currently-viewed");
});

function showModal() {}

document.addEventListener("click", (event) => {
  const target = event.target.closest("#designs-grid .bg-svg");
  if (target === null) return; // didn't click on designs
  event.stopImmediatePropagation(); // don't trigger the second event

  // show modal
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex", "currently-viewed");

  // set image source and alt text
  const modalImage = document.getElementById("modal-image");
  const projectName = target.dataset.projectName;
  const sizeWidth = target.dataset.sizeWidth;
  const sizeHeight = target.dataset.sizeHeight;
  const fullsizeImageUrl = `/static/projects/${projectName}/fullsize.webp`;
  modalImage.src = fullsizeImageUrl;
  modalImage.alt = projectName;
  modalImage.style.aspectRatio = `${sizeWidth} / ${sizeHeight}`;
});
