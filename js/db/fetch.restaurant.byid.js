/**
 * Database URL.
 * Change this to your server's.
 */
/**
 * Fetch a restaurant by its ID.
 */
function fetchRestaurantById(id, callback) {
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
            if (restaurant !== null) {
                // Got the restaurant
                callback(null, restaurant);
                return;
            }

            callback(`Restaurant ${id} does not exist`, null);
        })
        .catch(err => {
            callback(err, null);
        });
}
