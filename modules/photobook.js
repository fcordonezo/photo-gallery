import { photos } from "./photos.js";

export const createPhotoBook = (container) => {
    photos.forEach((photo, index) => buildElements(container, photo, index));
  }
  
  const buildElements = (container, photo, index) => {
    const card = document.createElement("div");
    const cardImage = document.createElement("div");
    const a = document.createElement("a");
    const img = new Image();
    card.classList.add("card");
    cardImage.classList.add("card-image");
    a.setAttribute("data-fancybox", "gallery");
    a.setAttribute("data-caption", photo.desc);
    a.setAttribute("data-slug", photo.name.concat(" en ", photo.place).replaceAll(" ", "-").replaceAll(/[\,\.]*/g,"").toLowerCase());
    a.href = photo.src;
    img.src = photo.thumb;
    img.alt = `${photo.name}. ${photo.place}. ${photo.city}${(photo.event? ". " + photo.event:"")}. ${photo.country}`;
    img.loading = "lazy";
    if(index === 0) {
      return;
    }
    a.appendChild(img);
    cardImage.appendChild(a);
    card.appendChild(cardImage);
    container.appendChild(card);
  }