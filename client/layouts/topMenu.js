Template.topMenu.helpers({
  activeIf: function (name) {
    return Helpers.routeIs(name) ? 'active' : '';
  },
});
