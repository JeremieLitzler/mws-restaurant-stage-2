function fetchRestaurantByIdInCache(id, callback) {
  getCacheItem(id)
    .then(restaurant => {
      callback(null, restaurant);
      fetchRestaurantByIdInApi(id, callback);
    })
    .catch(err => {
      callback(err, null);
    });
}

function fetchRestaurant(id) {
  return getCacheItem(id)
    .then(restaurant => {
      if (restaurant === undefined || restaurant === null) {
        var apiPromise = fetchRestaurantFromApi(id);
        return Promise.all(apiPromise).then(apiResponse => {
          return apiPromise; //already cached in fetchRestaurantFromApi
        });
      }
      fetchRestaurantFromApi(id); //call the api that will update the cache db.
      return restaurant;
    })
    .catch(err => {
      console.error(err);
    });
}
/**
 * Fetch a restaurant by its ID from the API.
 */
function fetchRestaurantByIdInApi(id, callback) {
  const DATABASE_URL = `http://localhost:1337/restaurants/${id}`;
  fetch(DATABASE_URL)
    .then(function(response) {
      if (response.ok) {
        const jsonData = response.json();
        console.log(jsonData);
        return jsonData;
      }
      if (DEBUG) console.log("Fetch failed response", response);
    })
    .then(restaurant => {
      cacheItem(restaurant)
        .then(response => {
          if (DEBUG)
            console.log(
              `Just updated restaurant ID ${restaurant.id}`,
              response
            );
          if (restaurant !== null) {
            // Got the restaurant
            callback(null, restaurant);
          }
        })
        .catch(err => {
          console.error(
            `Failed to cache the restaurant ID ${restaurant.id}in cache`,
            err
          );
          callback(null, restaurant);
        });
    })
    .catch(err => {
      console.error(
        "API is not available. Falling back to the static data...",
        err
      );
      const STATIC_DATA_URL = `${location.origin}/data/restaurants.json`;
      fetch(STATIC_DATA_URL)
        .then(response => {
          if (!response.ok) {
            return callback(response, null);
          }
          const jsonData = response.json();
          return jsonData;
        })
        .then(data => {
          const restaurants = Object.values(data.restaurants);
          cacheItem(restaurants[id]);
          callback(null, restaurants[id]);
        })
        .catch(err => {
          console.error("Some error appended", err);
          callback(err, null);
        });
    });
}
/**
 * Fetch a restaurant by its ID from the API.
 */
function fetchRestaurantFromApi(id) {
  const DATABASE_URL = `http://localhost:1337/restaurants/${id}`;
  fetch(DATABASE_URL)
    .then(function(response) {
      if (response.ok) {
        const jsonData = response.json();
        console.log(jsonData);
        return jsonData;
      }
      if (DEBUG) console.log("Fetch failed response", response);
    })
    .then(restaurant => {
      cacheItem(restaurant)
        .then(response => {
          if (DEBUG)
            console.log(
              `Just updated restaurant ID ${restaurant.id}`,
              response
            );
          return restaurant;
        })
        .catch(err => {
          console.error(
            `Failed to cache the restaurant ID ${restaurant.id}in cache`,
            err
          );
          return false;
        });
    })
    .catch(err => {
      return "Visit the home page!";
    });
}
