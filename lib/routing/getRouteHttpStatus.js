"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Return the status code from the last matched route with a status property.
 *
 * @param matchedRoutes
 * @returns {Number|null}
 */

exports.default = function (matchedRoutes) {
  return matchedRoutes.reduce(function (prev, cur) {
    return cur.status || prev;
  }, null);
};