import {createPhotoBook} from "./modules/photos.js";

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
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
          "flipX",
          "flipY",
          "fullScreen",
        ],
        right: ["slideshow", "thumbs", "download", "fullscreen", "share", "close"],
      },
    },
  });
});