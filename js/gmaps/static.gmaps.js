let mapContainer = document.querySelector(".map-container");
let staticMapContainer = document.querySelector("#static-map");

document.addEventListener("DOMContentLoaded", () => {
  console.log("staticMapContainer", staticMapContainer);
  console.log(
    `The static GMaps image must be ${mapContainer.offsetWidth} wide by ${
      mapContainer.offsetHeight
    } high`
  );
  //only when the map is on top of the list
  //WARNING: Google Static API accepts only int values for the width and height.
  let viewPortHeightPercent = 0.4;
  console.log(viewPortHeightPercent);
  let imageHeight = window.innerHeight;
  let imageWidth = mapContainer.offsetWidth;
  //natural size: https://developers.google.com/maps/documentation/maps-static/intro#scale_values
  let imageScale = 1;
  let defaultZoom = 11;
  if (window.innerWidth > 639) {
    //Google Static Api limits the width to 640px!
    //See: https://developers.google.com/maps/documentation/maps-static/intro#Imagesizes
    imageHeight = parseInt(
      640 * (window.innerHeight * viewPortHeightPercent) / window.innerWidth
    );
    imageScale = 2;
  }
  if (window.innerWidth < 649) {
    console.log("window height is < 649");
    imageWidth = window.innerWidth;
    imageHeight = parseInt(imageWidth * viewPortHeightPercent);
  }
  const staticApiDynamicUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${CENTER_LATITUDE},${CENTER_LONGITUDE}&scale=${imageScale}&zoom=${defaultZoom}&size=${imageWidth}x${imageHeight}&key=${STATIC_API_KEY}`;

  console.log("image url", staticApiDynamicUrl);
  const staticMapImg = document.createElement("img");
  staticMapImg.alt = "Static Google Maps";
  staticMapImg.src = staticApiDynamicUrl;
  staticMapContainer.appendChild(staticMapImg);
});

const dynamicMapContainer = document.getElementById("map");

mapContainer.addEventListener("click", () => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
mapContainer.addEventListener("mouseover", () => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
