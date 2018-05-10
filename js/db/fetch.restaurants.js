/**
 * Database URL.
 * Change this to your server's.
 */
const API_URL = "http://localhost:1337/restaurants";
const STATIC_DATA_URL = `${location.origin}/data/restaurants.json`;

function fetchRestaurantsWithPromise() {
    return fetchCachePromise();
}

/**
 * Fetch the IDB database.
 */
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
    return Promise.all(allGetItemPromises)
        .then(fullItems => {
            if (
                !fullItems ||
                fullItems === undefined ||
                fullItems === null ||
                fullItems.length === 0
            ) {
                //nothing in idb so query the api!
                return fetchApi2()
                    .then(apiItems => {
                        return apiItems;
                    })
                    .catch(err => {
                        console.error("Api call error", err);
                    });
            }
            fetchApi2(); //fetch the api to update the idb database.

            return fullItems; //... and return the idb values
        })
        .catch(err => {
            console.error("allGetItemPromises error", err);
        });
}

/**
 * Fetch the data at DATABASE_URL using the Web API method Fetch
 * Returns the resulting Promise.
 */
function fetchApi2() {
    return fetch(API_URL)
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
            return restaurants;
        })
        .catch(err => {
            console.error(
                "API is not available. Falling back to the static data...",
                err
            );
            fetchStaticDatabase();
        });
}
/**
 * To use on remote server as long as there is no api available.
 */
function fetchStaticDatabase() {
    fetch(STATIC_DATA_URL)
        .then(response => {
            if (!response.ok) {
                return false;
            }
            const jsonData = response.json();
            //console.log(jsonData);
            return jsonData;
        })
        .then(data => {
            const restaurants = Object.values(data.restaurants);
            cacheItems(restaurants);
            return restaurants;
        })
        .catch(err => {
            console.error("Some error appended", err);
            return false;
        });
}
