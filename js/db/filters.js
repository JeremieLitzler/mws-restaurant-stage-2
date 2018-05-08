/**
 * Fetch restaurants by a cuisine type with proper error handling.
 */
function fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    fetchRestaurants((error, restaurants) => {
        if (error) {
            callback(error, null);
        }
        if (restaurants === undefined || restaurants === null) {
            return;
        }
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
    });
}
/**
 * Fetch restaurants by a neighborhood with proper error handling.
 */
function fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    fetchRestaurants((error, restaurants) => {
        if (error) {
            callback(error, null);
        }
        if (restaurants === undefined || restaurants === null) {
            return;
        }

        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
    });
}
/**
 * Fetch restaurants by a cuisine type with proper error handling.
 */
function fetchRestaurantByCuisineWithPromise(cuisine) {
    return fetchRestaurants()
        .then(result => {
            if (!result) {
                return result;
            }

            // Filter restaurants to have only given cuisine type
            const results = restaurants.filter(r => r.cuisine_type == cuisine);
            return results;
        })
        .catch(err => {
            console.error("Error in fetchRestaurantByCuisine", err);
        });
}
/**
 * Fetch restaurants by a neighborhood with proper error handling.
 */
function fetchRestaurantByNeighborhoodWithPromise(neighborhood) {
    return fetchRestaurants()
        .then(result => {
            if (!result) {
                return result;
            }

            // Filter restaurants to have only given cuisine type
            const results = restaurants.filter(
                r => r.neighborhood == neighborhood
            );
            return results;
        })
        .catch(err => {
            console.error("Error in fetchRestaurantByNeighborhood", err);
        });
}
/**
 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
 */
function fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
) {
    // Fetch all restaurants
    fetchRestaurants((error, restaurants) => {
        if (error) {
            callback(error, null);
        }
        if (restaurants === undefined || restaurants === null) {
            return;
        }

        let results = restaurants;
        if (cuisine != "all") {
            // filter by cuisine
            results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") {
            // filter by neighborhood
            results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
    });
}
/**
 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
 */
function fetchRestaurantFiltered(cuisine, neighborhood) {
    // Fetch all restaurants
    fetchRestaurants()
        .then(restaurants => {
            if (!restaurants) {
                return false;
            }
            if (restaurants === undefined || restaurants === null) {
                return;
            }

            let results = restaurants;
            if (cuisine != "all") {
                // filter by cuisine
                results = results.filter(r => r.cuisine_type == cuisine);
            }
            if (neighborhood != "all") {
                // filter by neighborhood
                results = results.filter(r => r.neighborhood == neighborhood);
            }
            return results;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * Fetch all neighborhoods with proper error handling.
 */
function fetchNeighborhoods(callback) {
    // Fetch all restaurants
    fetchRestaurants((error, restaurants) => {
        if (error) {
            callback(error, null);
        }
        if (restaurants === undefined || restaurants === null) {
            return;
        }

        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
            (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
            (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods, new IndexPage());
    });
}

/**
 * Fetch all cuisines with proper error handling.
 */
function fetchCuisines(callback) {
    // Fetch all restaurants
    fetchRestaurants((error, restaurants) => {
        if (error) {
            callback(error, null);
        }
        if (restaurants === undefined || restaurants === null) {
            return;
        }

        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
            (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines, new IndexPage());
        if (restaurants === undefined || restaurants === null) {
            return;
        }
    });
}

/**
 * Fetch all neighborhoods with proper error handling.
 */
function getValuesFor(type) {
    if (type !== "cuisine" && type !== "neighborhood") {
        throw "type parameter must be cuisine or neighborhood";
    }
    // Fetch all restaurants
    return fetchRestaurantsWithPromise()
        .then(restaurants => {
            let values = [];
            if (type === "cuisine") {
                values = restaurants.map((v, i) => restaurants[i].cuisine_type);
            }
            if (type === "neighborhood") {
                values = restaurants.map((v, i) => restaurants[i].neighborhood);
            }
            const uniqueValues = values.filter(
                (v, i) => values.indexOf(v) == i
            );
            return uniqueValues;
        })
        .catch(err => {
            console.error(err);
        });
}
