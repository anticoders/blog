Template.sidebar.events({
  'click [data-action=toggle]': function (e, t) {
    t.$('.sidebar').sidebar('toggle');
  }
});
