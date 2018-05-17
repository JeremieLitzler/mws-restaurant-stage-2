let mapContainer = document.querySelector(".map-container");
let staticMapContainer = document.querySelector("#static-map");

class StaticMapGenerator {
  constructor(targetPage) {
    this.targetPage = targetPage;
    //only when the map is on top of the list
    //WARNING: Google Static API accepts only int values for the width and height.
    this.imageWidth = mapContainer.offsetWidth;
    this.imageHeight = window.innerHeight;
    //natural size: https://developers.google.com/maps/documentation/maps-static/intro#scale_values
    this.imageScale = 1;
    this.defaultZoom = 11;
  }

  static get widthHeightRatio() {
    return 0.4;
  }
  static get maxWidthForFreeApiPlan() {
    return 640;
  }

  /**
   * Google Static Api limits the width to 640px!
   * See: https://developers.google.com/maps/documentation/maps-static/intro#Imagesizes
   */
  doesWindowWidthExceedFreePlan() {
    return window.innerWidth > StaticMapGenerator.maxWidthForFreeApiPlan;
  }

  isWindowWidthUnderTabletBreakPoint() {
    return window.innerWidth < 650;
  }

  getImageHeightInPx() {
    const height = parseInt(
      StaticMapGenerator.maxWidthForFreeApiPlan *
        (window.innerHeight * StaticMapGenerator.widthHeightRatio) /
        window.innerWidth
    );
    return height;
  }

  getApiUrl() {
    if (this.doesWindowWidthExceedFreePlan()) {
      this.imageHeight = this.getImageHeightInPx();
      this.imageScale = 2;
    }
    if (this.isWindowWidthUnderTabletBreakPoint()) {
      this.imageWidth = window.innerWidth;
      this.imageHeight = parseInt(
        this.imageWidth * StaticMapGenerator.widthHeightRatio
      );
    }
    const apiUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${CENTER_LATITUDE},${CENTER_LONGITUDE}&scale=${
      this.imageScale
    }&zoom=${this.defaultZoom}&size=${this.imageWidth}x${
      this.imageHeight
    }&key=${STATIC_API_KEY}`;

    return apiUrl;
  }

  createStaticMapImageElement() {
    const staticMapImg = document.createElement("img");
    staticMapImg.alt = "Static Google Maps";
    staticMapImg.src = this.getApiUrl();
    staticMapContainer.appendChild(staticMapImg);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new StaticMapGenerator().createStaticMapImageElement();
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
