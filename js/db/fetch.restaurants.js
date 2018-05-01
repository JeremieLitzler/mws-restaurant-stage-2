/**
 * Database URL.
 * Change this to your server's.
 */
const DATABASE_URL = "http://localhost:1337/restaurants";

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
                items.push(getItem(key));
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
    fetch(DATABASE_URL)
        .then(function(response) {
            if (response.ok) {
                const jsonData = response.json();
                console.log(jsonData);
                return jsonData;
            }
            console.log("Fetch failed response", response);
        })
        .then(function(restaurants) {
            cacheItems(restaurants);
            callback(null, restaurants);
        })
        .catch(function(err) {
            console.error("Some error appended", err);
            callback(err, null);
        });
}
