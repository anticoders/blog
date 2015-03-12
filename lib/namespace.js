
Utils.namespace = namespace;

/**
 * Set or get a possibly nested property of the root object.
 * Fail nicely if the provided path breaks at some point.
 *
 * @param {object} root    - object to operate on
 * @param {path}   path    - dot-separated path identifing the requested resource
 * @param {*}      [value] - if present, the value will be set at the give path
 */
function namespace (root, path, value) {
  path = typeof path === 'string' ? path.split('.') : path;
  if (path.length === 0 || !root || typeof root !== 'object') { // it's just an edge case, should hardly ever happen
    return arguments.length > 2 ? undefined : (path.length > 0 ? undefined : root);
  }
  if (arguments.length > 2) {
    if (path.length === 1) {
      root[path[0]] = value;
      return;
    }
    if (!root[path[0]] || typeof root[path[0]] !== 'object') {
      root[path[0]] = {};
    }
    namespace(root[path[0]], path.slice(1), value);
  } else {
    return namespace(root[path[0]], path.slice(1));
  }
}
