
Template.body.rendered = function () {
  this.$('body').addClass('pushable');
}

Template.body.events({
  'click [data-action=scrollTop]': function () {
    // 'body' will not work in all browsers ...
    $(window).scrollTop(0);
  },
  'click [data-action=logout]': function () {
    Meteor.logout();
  },
});
