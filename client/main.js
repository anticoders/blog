
Template.body.rendered = function () {
  $('body').addClass('dimmable pushable');
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
