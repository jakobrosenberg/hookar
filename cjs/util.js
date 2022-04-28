"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOnce = void 0;

/**
 * @template {function} CB
 * @param {CB} cb
 * @returns {CB}
 */
var runOnce = function runOnce(cb) {
  var hasRun;
  /** @type {unknown} */

  var wrapper = function wrapper() {
    if (hasRun) return;
    hasRun = true;
    return cb.apply(void 0, arguments);
  };

  return (
    /** @type {CB} */
    wrapper
  );
};

exports.runOnce = runOnce;
//# sourceMappingURL=util.js.map