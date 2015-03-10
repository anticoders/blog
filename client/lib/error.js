
App.error = function (err, options) {
  
  var data = {};

  if (err instanceof Error) {
    data.title       = 'We have experienced an unexpected error ...';
    data.description = 'An exception was thrown with the following message:';
    data.error       = err;
  } else {
    data = err;
  }

  if (data.error === undefined) {
    data.error = new Error(data.description);
  }

  // log this error to console as well (e.g. Kadira will be able to see it)
  console.error(data.error);

  if (!options.onHide) {
    options.onHide = function (deferred) {
      deferred.resolve();
    }
  }

  return App.modal('errorModal', data, options);
};
