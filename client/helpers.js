
Helpers.routeIs = function (name) {
  return Router.current().route.getName() === name;
};

Helpers.enumerated = function (listOfObjects) {
  return _.map(listOfObjects, function (object, index) {
    return _.extend({ index: index }, object);
  });
};

Helpers.breadcrumb = function () {
  return Iron.controller().breadcrumb;
};

Template.registerHelper('$helpers', function () {
  return Helpers;
});

Template.registerHelper('$app', function () {
  return App;
});
