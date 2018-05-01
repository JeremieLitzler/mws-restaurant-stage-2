function cacheItems(items) {
    items.forEach(item => {
        cacheItem(item);
    });
}
function cacheItem(item) {
    //console.log(`About to cache the item which id is ${item.id}`);
    idbKeyval.set(item.id, item);
}
function getItem(key) {
    return idbKeyval.get(key);
}
