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
function fetchRestaurantFiltered(filters) {
    // Fetch all restaurants
    return fetchRestaurantsWithPromise()
        .then(restaurants => {
            let results = restaurants;
            if (filters.cuisine != "all") {
                // filter by cuisine
                results = results.filter(
                    r => r.cuisine_type == filters.cuisine
                );
            }
            if (filters.neighborhood != "all") {
                // filter by neighborhood
                results = results.filter(
                    r => r.neighborhood == filters.neighborhood
                );
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
function getFilters() {
    // Fetch all restaurants
    return fetchRestaurantsWithPromise()
        .then(restaurants => {
            const filters = {};
            const cuisines = restaurants.map(
                (v, i) => restaurants[i].cuisine_type
            );
            const neighborhoods = restaurants.map(
                (v, i) => restaurants[i].neighborhood
            );

            filters.cuisines = cuisines.filter(
                (v, i) => cuisines.indexOf(v) == i
            );
            filters.neighborhoods = neighborhoods.filter(
                (v, i) => neighborhoods.indexOf(v) == i
            );
            return filters;
        })
        .catch(err => {
            console.error(err);
        });
}
