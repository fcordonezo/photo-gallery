import {createPhotoBook} from "./modules/photobook.js";

document.addEventListener("DOMContentLoaded", () => {

  createPhotoBook(document.getElementById("photobook-container"));
  
  Fancybox.bind('[data-fancybox="gallery"]', {
    contentClick: "iterateZoom",
    Images: {
      Panzoom: {
        maxScale: 1.5,
      },
    },
    Toolbar: {
      display: {
        left: ["infobar"],
        right: ["slideshow", "thumbs", "download", "fullscreen", "share", "close"],
      },
    },
  });
});