
Template.userCard.helpers({
  avatarUrl: function () {
    return this.avatarUrl || Meteor.absoluteUrl('assets/images/avatars/default_00.svg');
  },
  joinedInYear: function () {
    return moment(this.joinedAt).year();
  },
});
