
App.prompt = function (data, options) {

  options = options || {};

  if (!options.onApprove) {
    options.onApprove = function (deferred) {
      deferred.resolve();
    };
  }

  if (!options.onDeny) {
    options.onDeny = function (deferred) {
      deferred.reject();
    };
  }

  return App.modal('promptModal', data, options);
};
