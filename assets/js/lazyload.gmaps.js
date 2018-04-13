let displayGmaps = document.querySelector(".display-gmaps");

displayGmaps.addEventListener("click", () => {
  var mapContainer = document.getElementById("map-container");
  mapContainer.style.display = "block";
});
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
  updateRestaurants();
}

async function google_maps_lazyload(api_key) {
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
