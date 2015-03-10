
Template.body.rendered = function () {
  $('body').addClass('dimmable pushable scrollable');
}

Template.body.events({
  'click [data-action=scrollTop]': function () {
    // 'body' will not work in all browsers ...
    $(document).scrollTop(0);
  },
  'click [data-action=logout]': function () {
    Meteor.logout();
  },
});
