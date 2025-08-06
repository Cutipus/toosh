"use strict";

// nav colors
document.addEventListener("DOMContentLoaded", updateActiveLink);
document.addEventListener("htmx:pushedIntoHistory", updateActiveLink);
document.addEventListener("htmx:load", updateActiveLink);

function updateActiveLink() {
  const currentPath = window.location.pathname;

  // Remove the active class from all nav links
  document
    .getElementById("navi")
    .querySelectorAll("a")
    .forEach((link) => {
      link.dataset.selected = "false";
    });

  // Add the active class to the link that matches the current path
  const activeLinkIsCurrentLink = document.querySelector(`a[data-path="${currentPath}"]`);

  if (activeLinkIsCurrentLink) {
    activeLinkIsCurrentLink.dataset.selected = "true";
  }
}
