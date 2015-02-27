
Helpers.routeIs = function (name) {
  return Router.current().route.getName() === name;
}

Template.registerHelper('$global', function () {
  return Helpers;
});
