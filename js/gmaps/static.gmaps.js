let mapContainer = document.getElementById("map-container");
let staticMapContainer = document.getElementById("static-map");

document.addEventListener("DOMContentLoaded", event => {
  console.log("staticMapContainer", staticMapContainer);
  console.log(
    `The static GMaps image must be ${mapContainer.offsetWidth} wide by ${
      mapContainer.offsetHeight
    } high`
  );
  const STATIC_API_KEY = "AIzaSyB8mGRExPGJ5-h6QjBu1-MsUoAm4kWKaqY";
  let defaultHeight = window.innerHeight;
  let defaultZoom = 13;
  if (window.innerWidth < 649) {
    //only when the map is on top of the list
    //WARNING: Google Static API accepts only int values for the width and height.
    defaultHeight = parseInt(window.innerHeight / 5);
    defaultZoom = 9;
  }
  const staticApiDynamicUrl = `https://maps.googleapis.com/maps/api/staticmap?center=40.7125844,-73.9713328&zoom=12&size=${
    mapContainer.offsetWidth
  }x${
    mapContainer.offsetHeight === 0 ? defaultHeight : mapContainer.offsetHeight
  }&key=${STATIC_API_KEY}`;

  const staticMapImg = document.createElement("img");
  staticMapImg.alt = "Static Google Maps";
  staticMapImg.src = staticApiDynamicUrl;
  staticMapContainer.appendChild(staticMapImg);
});

const dynamicMapContainer = document.getElementById("map");

mapContainer.addEventListener("click", event => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
mapContainer.addEventListener("mouseover", event => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
