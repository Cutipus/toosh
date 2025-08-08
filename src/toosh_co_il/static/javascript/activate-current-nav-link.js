"use strict";

document.addEventListener("DOMContentLoaded", updateActiveLink);
document.addEventListener("htmx:pushedIntoHistory", updateActiveLink);
document.addEventListener("htmx:load", updateActiveLink);

function updateActiveLink() {
  const currentPath = window.location.pathname;

  // Remove the active class from all nav links
  document
    .getElementById("navi")
    .querySelectorAll("a")
    .forEach((link) => link.classList.remove("currently-viewed"));

  // Add the active class to the current link
  document.querySelector(`a[data-path="${currentPath}"]`)?.classList.add("currently-viewed");
}
