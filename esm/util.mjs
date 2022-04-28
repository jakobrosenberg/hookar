/**
 * @template {function} CB
 * @param {CB} cb
 * @returns {CB}
 */
export const runOnce = (cb) => {
  let hasRun;

  /** @type {unknown} */
  const wrapper = (...params) => {
    if (hasRun) return;
    hasRun = true;
    return cb(...params);
  };

  return /** @type {CB} */ (wrapper);
};
