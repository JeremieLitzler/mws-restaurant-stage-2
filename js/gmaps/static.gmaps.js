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

  static get widthHeightRatioNarrow() {
    return 0.4;
  }
  static get widthHeightRatioWide() {
    return 1.2;
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

  /**
   * Calculate the image height in pixels using the given ratio.
   * @param {float} ratio | StaticMapGenerator.widthHeightRatio
   */
  getImageHeightInPx(ratio = StaticMapGenerator.widthHeightRatio) {
    const height = parseInt(
      StaticMapGenerator.maxWidthForFreeApiPlan *
        (window.innerHeight * ratio) /
        window.innerWidth
    );
    return height;
  }
  /**
   * Get the Google Maps Static API Url to generate the image.
   * The center is defined by CENTER_LATITUDE and CENTER_LONGITUDE constants.
   */
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
  getApiUrlForRestaurant(restaurant) {
    this.defaultZoom = 16;
    if (this.doesWindowWidthExceedFreePlan()) {
      this.imageHeight = this.getImageHeightInPx(
        StaticMapGenerator.widthHeightRatioWide
      );
      this.imageScale = 2;
    }
    if (this.isWindowWidthUnderTabletBreakPoint()) {
      this.imageWidth = window.innerWidth;
      this.imageHeight = parseInt(
        this.imageWidth * StaticMapGenerator.widthHeightRatio
      );
    }
    const apiUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=color:red%7C${
      restaurant.latlng.lat
    },${restaurant.latlng.lng}&scale=${this.imageScale}&zoom=${
      this.defaultZoom
    }&size=${this.imageWidth}x${this.imageHeight}&key=${STATIC_API_KEY}`;

    console.log(apiUrl);
    return apiUrl;
  }
}

const dynamicMapContainer = document.getElementById("map");

mapContainer.addEventListener("click", () => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
mapContainer.addEventListener("mouseover", () => {
  dynamicMapContainer.style.display = "block";
  staticMapContainer.style.display = "none";
});
