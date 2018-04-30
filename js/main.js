class IndexPage {
  constructor(map) {
    this.map = map;
    this.markers = [];
    this.restaurants = null;
  }
  setRestaurants(restaurants) {
    this.restaurants = restaurants;
    return this;
  }
  hideLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.style.display = "none";
    return this;
  }
  /**
   * Fetch all neighborhoods and set their HTML.
   */
  fetchNeighborhoods() {
    let page = this;
    fetchNeighborhoods((error, neighborhoods, page) => {
      if (error) {
        // Got an error
        console.error(error);
      } else {
        page.fillNeighborhoodsHTML(neighborhoods);
      }
    });
  }
  /**
   * Set neighborhoods HTML.
   */
  fillNeighborhoodsHTML(neighborhoods) {
    const select = document.getElementById("neighborhoods-select");
    neighborhoods.forEach(neighborhood => {
      const option = document.createElement("option");
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      select.append(option);
    });
  }
  /**
   * Fetch all cuisines and set their HTML.
   */
  fetchCuisines() {
    let page = this;

    fetchCuisines((error, cuisines, page) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        page.fillCuisinesHTML(cuisines);
      }
    });
  }
  /**
   * Set cuisines HTML.
   */
  fillCuisinesHTML(cuisines) {
    const select = document.getElementById("cuisines-select");
    cuisines.forEach(cuisine => {
      const option = document.createElement("option");
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    });
  }
  readFilters() {
    const cSelect = document.getElementById("cuisines-select");
    const nSelect = document.getElementById("neighborhoods-select");
    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;
    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;
    return {
      cuisine: cuisine,
      neighborhood: neighborhood
    };
  }

  /**
   * Update page and map for current restaurants.
   */
  updateRestaurants() {
    const filters = this.readFilters();
    document.getElementById("filters-modal").style.display = "none";
    fetchRestaurantByCuisineAndNeighborhood(
      filters.cuisine,
      filters.neighborhood,
      (error, restaurants) => {
        const page = new IndexPage();
        if (error) {
          // Got an error!
          console.error(error);
        } else {
          page
            .setRestaurants(restaurants)
            .hideLoadingScreen()
            .resetRestaurants()
            .fillRestaurantsHTML();
        }
      }
    );
  }
  /**
   * Clear current restaurants, their HTML and remove their map markers.
   */
  resetRestaurants() {
    const ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";
    // Remove all map markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    return this;
  }
  /**
   * Create all restaurants HTML and add them to the webpage.
   */
  fillRestaurantsHTML() {
    const ul = document.getElementById("restaurants-list");
    let noResultsElement = document.querySelector(".no-restaurant-msg");
    if (this.restaurants.length === 0) {
      noResultsElement.style.display = "block";
    } else {
      //Make sure the paragraph is not displayed on a new search
      //yielding results after an empty search.
      noResultsElement.style.display = "none";
    }
    this.restaurants.forEach(restaurant => {
      ul.append(this.createRestaurantHTML(restaurant));
    });
    const filtersContainer = document.getElementById("filters");
    //console.log("about to focus element id filters...");
    filtersContainer.focus();
    //console.log("element id filters focused? document.activeElement:", document.activeElement);
    return this;
  }
  /**
   * Create restaurant HTML.
   */
  createRestaurantHTML(restaurant) {
    const li = document.createElement("li");
    li.className = "restaurant-container row-default";
    const imageContainer = document.createElement("div");
    imageContainer.className = "restaurant-img-container";
    const image = document.createElement("img");
    image.className = "lazyload restaurant-img";
    image.alt = `${restaurant.name} restaurant, ${restaurant.shortDesc}`;
    image.src = imageUrlForRestaurant(restaurant, 128, true);
    image.setAttribute("data-src", imageUrlForRestaurant(restaurant, 128));
    imageContainer.appendChild(image);
    li.append(imageContainer);
    const descriptionItems = document.createElement("div");
    descriptionItems.className = "descriptions";
    const name = document.createElement("h2");
    name.innerHTML = restaurant.name;
    descriptionItems.append(name);
    const neighborhood = document.createElement("p");
    neighborhood.className = "neighborhood";
    neighborhood.innerHTML = restaurant.neighborhood;
    descriptionItems.append(neighborhood);
    const address = document.createElement("p");
    address.className = "address";
    address.innerHTML = restaurant.address;
    descriptionItems.append(address);
    li.append(descriptionItems);
    const moreContainer = document.createElement("span");
    moreContainer.className = "more-container";
    const more = document.createElement("a");
    const moreBtnTitle = `Read ${restaurant.name}'s restaurant details`;
    more.className = "c-btn btn-default btn-small btn-more";
    more.innerHTML = "View details";
    more.setAttribute("aria-label", moreBtnTitle);
    more.title = moreBtnTitle;
    more.href = urlForRestaurant(restaurant);
    moreContainer.appendChild(more);
    li.append(moreContainer);
    return li;
  }
  updateMarkers() {
    const filters = this.readFilters();
    fetchRestaurantByCuisineAndNeighborhood(
      filters.cuisine,
      filters.neighborhood,
      (error, restaurants) => {
        const page = new IndexPage();
        if (error) {
          // Got an error!
          console.error(error);
        } else {
          page.setRestaurants(restaurants).addMarkersToMap();
        }
      }
    );
  }
  /**
   * Add markers for current restaurants to the map.
   */
  addMarkersToMap() {
    this.restaurants.forEach(restaurant => {
      // Add marker to the map
      const marker = MapsMarker.mapMarkerForRestaurant(restaurant, map);
      google.maps.event.addListener(marker, "click", () => {
        window.location.href = marker.url;
      });
      this.markers.push(marker);
    });
  }
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  new IndexPage().fetchNeighborhoods();
  new IndexPage().fetchCuisines();
});
