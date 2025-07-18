import { createPhotoBook } from "./modules/photobook.js";

document.addEventListener("DOMContentLoaded", () => {

  createPhotoBook(document.getElementById("photobook-container"));

  Fancybox.bind('[data-fancybox="gallery"]', {
    Hash: false,
    mainStyle: {
      "--f-toolbar-padding": "16px 32px",
      "--f-toolbar-gap": "8px",
      "--f-button-border-radius": "50%",
      "--f-thumb-width": "82px",
      "--f-thumb-height": "82px",
      "--f-thumb-opacity": "0.5",
      "--f-thumb-hover-opacity": "1",
      "--f-thumb-selected-opacity": "1",
    },
    showClass: "f-fadeIn",
    contentClick: "iterateZoom",
  });
});