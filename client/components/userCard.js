
Template.userCard.helpers({
  joinedInYear: function () {
    return moment(this.joinedAt).year();
  },
});
