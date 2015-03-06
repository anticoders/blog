
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

Template.registerHelper('$', function () {
  // we create a proxy object to make sure that the helper will receive the right context
  // (otherwise this would be equal to Helpers object itself)
  return new Proxy(this);
});

function Proxy (context) {
  this.context = context;
}

Meteor.startup(function () {
  _.each(Helpers, function (helper, name) {
    Proxy.prototype[name] = function () {
      return helper.apply(this.context, arguments);
    };
  });
});
