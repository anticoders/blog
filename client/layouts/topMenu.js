
Template.topMenu.rendered = function () {

}

Template.topMenu.helpers({
  activeIf: function (name) {
    return Helpers.routeIs(name) ? 'active' : '';
  },
  hiddenIf: function (name) {
    return Helpers.routeIs(name) ? 'hidden' : '';
  },
  hint: function () {
    var controller = Iron.controller();
    if (controller && controller.hint) {
      return controller.hint.get();
    }
  }
});
