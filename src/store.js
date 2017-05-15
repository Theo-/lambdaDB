// Defines a key-store interface

var Store = {
    values: {},

    store: function(key, value) {
        Store.values[key] = value;
    },

    add: function(key, value) {
        Store.values[key] += value;
    },

    clear: function(key) {
        Store.values[key] = null;
    },

    isSet: function(key) {
        return Store.values[key] != null;
    }
};

module.exports = Store;