/**
 * Database URL.
 * Change this to your server's.
 */
const API_URL = "http://localhost:1337/restaurants";
const STATIC_DATA_URL = `${location.origin}/data/restaurants.json`;

/**
 * Fetch all restaurants.
 * @param {*} callback
 */
function fetchRestaurants(callback) {
    fetchCache(callback);
}

function fetchCache(callback) {
    idbKeyval
        .keys()
        .then(response => {
            console.log("idb keys", response);
            const items = [];
            response.forEach(key => {
                getCacheItem(key)
                    .then(value => {
                        items.push(value);
                    })
                    .catch(err => {
                        console.error("GetCacheItem failed", err);
                    });
            });
            //still fetch the API in the background to update the cache.
            fetchApi(callback);

            //and return the cache items immediatly
            callback(null, items);
        })
        .catch(err => {
            callback(err, null);
        });
}

/**
 * Fetch the data at DATABASE_URL using the Web API method Fetch
 * @param {*} callback
 */
function fetchApi(callback) {
    fetch(API_URL)
        .then(response => {
            if (response.ok) {
                const jsonData = response.json();
                //console.log(jsonData);
                return jsonData;
            }
            console.log("Fetch failed response", response);
        })
        .then(restaurants => {
            cacheItems(restaurants);
            callback(null, restaurants);
        })
        .catch(err => {
            console.error(
                "API is not available. Falling back to the static data...",
                err
            );
            fetch(STATIC_DATA_URL)
                .then(response => {
                    if (!response.ok) {
                        return callback(response, null);
                    }
                    const jsonData = response.json();
                    //console.log(jsonData);
                    return jsonData;
                })
                .then(data => {
                    const restaurants = Object.values(data.restaurants);
                    cacheItems(restaurants);
                    callback(null, restaurants);
                })
                .catch(err => {
                    console.error("Some error appended", err);
                    callback(err, null);
                });
        });
}
