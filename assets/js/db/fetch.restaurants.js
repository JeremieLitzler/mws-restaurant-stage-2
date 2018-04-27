/**
 * Database URL.
 * Change this to your server's.
 */
const DATABASE_URL = `http://localhost:1337/restaurants`;

/**
 * Fetch all restaurants.
 * @param {*} callback
 */
function fetchRestaurants(callback) {
  fetchDatabaseData(callback);
}
/**
 * Fetch the data at DBHelper.DATABASE_URL using the Web API method Fetch
 * @param {*} callback
 */
function fetchDatabaseData(callback) {
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
      callback(null, restaurants);
    })
    .catch(function(err) {
      console.error("Some error appended", err);
    });
}
