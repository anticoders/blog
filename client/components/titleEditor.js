
Template.titleEditor.rendered = function () {
  //we need to non-reactively add title to prevent updating DOM content during editing
  var staticTitle = this.data.title;
  this.$('.title-edit').html(staticTitle);
};

Template.titleEditor.events({
  'keyup .title-edit': function (e, t) {
    var hint = App.getHintFunction();
    var updates = {};
    hint('saving ...');
    updates['title'] = $(e.target).html();
    App.doUpdate(this._id, updates, function () {
      hint('');
    });
  }
});
