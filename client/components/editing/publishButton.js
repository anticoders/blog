
Template.publishButton.helpers({
  publishButtonTitle: function () {
    var hint = App.hint();
    if (hint) {
      return hint;
    }
    if (this.isModified()) {
      return 'publish your changes';
    }
    return 'everything is up to date';
  },
  disabled: function () {
    var hint = App.hint();
    if (hint) {
      return 'disabled';
    }
    return this.isModified() ? '' : 'disabled';
  },
});

Template.publishButton.events({
  'click [data-action=publish]': function(e, t) {
    var hint = App.getHintFunction();
    hint('publishing ...');
    Meteor.call('publish', t.data._id, function (err) {
      if (err) {
        App.error(err);
      }
      Meteor.setTimeout(function () {
        hint('');
      }, 1000);
    });
  }
});
