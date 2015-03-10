
Template.titleEditor.rendered = function () {
  //we need to non-reactively add title to prevent updating DOM content during editing
  var staticTitle = this.data.title;
  this.$('.title-edit').html(staticTitle);
};

Template.titleEditor.events({
  'keyup .title-edit': function (e, t) {
    App.autosave(this._id, { $set: { title: $(e.target).html() }});
  }
});
