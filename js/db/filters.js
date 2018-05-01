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
