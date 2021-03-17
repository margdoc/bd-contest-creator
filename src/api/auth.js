"use strict";
exports.__esModule = true;
exports.removeAuthToken = exports.getAuthToken = exports.setAuthToken = void 0;
var key = "auth-token";
var setAuthToken = function (token) {
    window.localStorage.setItem(key, token);
};
exports.setAuthToken = setAuthToken;
var getAuthToken = function () {
    return window.localStorage.getItem(key);
};
exports.getAuthToken = getAuthToken;
var removeAuthToken = function () {
    window.localStorage.removeItem(key);
};
exports.removeAuthToken = removeAuthToken;
