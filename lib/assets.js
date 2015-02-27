/**
 * Returns an absolute URL to the give asset.
 */
Helpers.asset = function (path) {
  return Meteor.absoluteUrl('assets/' + path);
}
