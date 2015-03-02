
/**
 * Retursn a constant function.
 */
Utils.constant = function (value) {
  return function () {
    return value;
  }
};
