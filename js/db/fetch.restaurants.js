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

function fetchRestaurantsWithPromise() {
    return fetchCachePromise();
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

function fetchCachePromise() {
    return idbKeyval
        .keys()
        .then(data => {
            return parseData(data);
        })
        .catch(err => {
            console.error(err, null);
            return false;
        });
}

function parseData(data) {
    var allGetItemPromises = [];
    data.forEach(key => {
        allGetItemPromises.push(
            getCacheItem(key)
                .then(value => {
                    return value;
                })
                .catch(err => {
                    console.error("GetCacheItem failed", err);
                })
        );
    });
    console.log(allGetItemPromises);
    return Promise.all(allGetItemPromises).then(fullItems => {
        if (!fullItems) {
            return false;
        }
        if (
            fullItems === undefined ||
            fullItems === null ||
            fullItems.length === 0
        ) {
            return false;
        }

        return fullItems;
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
