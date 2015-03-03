/**
 * Returns an absolute URL to the give asset.
 */
Helpers.asset = function (path) {
  return "https://s3-us-west-2.amazonaws.com/anticoders/assets/" + path;
};

/**
 * Move item in array
 */

Helpers.moveInArray = function (array, old_index, new_index) {
  while (old_index < 0) {
    old_index += array.length;
  }
  while (new_index < 0) {
    new_index += array.length;
  }
  if (new_index >= array.length) {
    var k = new_index - array.length;
    while ((k--) + 1) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array; // for testing purposes
};