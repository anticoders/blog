
Template.profile.events({
  'submit .ui.form': function (e, t) {
    e.preventDefault();
    var data = t.$('.ui.form').form('get values');
    var updates = {};
    _.each(data, function (value, key) {
      updates['profile.' + key] = value;
    });
    if (_.isEmpty(updates)) {
      return;
    }
    Meteor.users.update({ _id: Meteor.userId() }, { $set: updates });
  },
});
