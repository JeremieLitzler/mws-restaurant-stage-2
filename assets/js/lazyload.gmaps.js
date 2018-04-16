class MapsMarker {
  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}
let displayGmaps = document.querySelector(".display-gmaps");

if (displayGmaps != null) {
  displayGmaps.addEventListener("click", () => {
    const mapContainer = document.querySelector("#map");
    mapContainer.style.display = "block";
    displayGmaps.innerHTML = "Hide the map";
  });
}
/* Licence Creative Commons Attribution 4.0 International License - Walter Ebert (https://walterebert.com/blog/lazy-loading-google-maps-with-the-intersection-observer-api/) */
function google_maps_init() {
  "use strict";

  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  const page = new IndexPage();
  page.updateRestaurants();
  page.addMarkersToMap();
}
/**
 * Lazy load the Google Map.
 * @param {*} api_key
 */
function google_maps_lazyload(api_key) {
  "use strict";

  if (api_key) {
    var options = {
      rootMargin: "100px",
      threshold: 0
    };

    var map = document.getElementById("map");

    var observer = new IntersectionObserver(function(entries, self) {
      // Intersecting with Edge workaround https://calendar.perfplanet.com/2017/progressive-image-loading-using-intersection-observer-and-sqip/#comment-102838
      var isIntersecting =
        typeof entries[0].isIntersecting === "boolean"
          ? entries[0].isIntersecting
          : entries[0].intersectionRatio > 0;
      if (isIntersecting) {
        loadJS(
          "https://maps.googleapis.com/maps/api/js?callback=google_maps_init&libraries=places&key=" +
            api_key
        );
        self.unobserve(map);
      }
    }, options);

    observer.observe(map);
  }
}

google_maps_lazyload("AIzaSyBXysE433qRY0W9gup0-_N5UF_0ObJK3oc");
