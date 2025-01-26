import { photos } from "./photos.js";

export const createPhotoBook = (container) => {
    photos
      .forEach((photo) => buildElements(container, photo));
  }
  
  const buildElements = (container, photo) => {
    const card = document.createElement("div");
    const cardImage = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    card.classList.add("card");
    cardImage.classList.add("card-image");
    a.setAttribute("data-fancybox", "gallery");
    a.setAttribute("data-caption", photo.desc);
    a.href = photo.src;
    img.src = photo.thumb || photo.src;
    img.alt = photo.name + ". " + photo.place + ". " +  photo.city + (photo.event? ". " + photo.event:"") + ". " + photo.country;
    img.loading = "lazy";
    a.appendChild(img);
    cardImage.appendChild(a);
    card.appendChild(cardImage);
    container.appendChild(card);
  }