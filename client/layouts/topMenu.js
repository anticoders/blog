
Template.topMenu.rendered = function () {

};

Template.topMenu.helpers({
  activeIf: function (name) {
    return Helpers.routeIs(name) ? 'active' : '';
  },
  activeUnless: function (name) {
    return Helpers.routeIs(name) ? '' : 'active';
  },
  hint: function () {
    var controller = Iron.controller();
    if (controller && controller.hint) {
      return controller.hint.get();
    }
  },
  year: function () {
    return moment().year();
  },
});
