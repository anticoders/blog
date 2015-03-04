
Template.profile.events({
  'submit .ui.form': function (e, t) {
    e.preventDefault();
    var data = t.$('.ui.form').form('get values');
    console.log('submit', data);
  }
});
