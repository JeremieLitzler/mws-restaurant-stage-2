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
            console.log("Fetch failed response", response);
        })
        .then(restaurant => {
            cacheItem(restaurant)
                .then(response => {
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
                        `Failed to cache the restaurant ID ${
                            restaurant.id
                        }in cache`,
                        err
                    );
                    callback(null, restaurant);
                });
        })
        .catch(err => {
            callback(err, null);
        });
}
