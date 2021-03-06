
Template.summaryEditor.rendered = function () {
  //we need to non-reactively add title to prevent updating DOM content during editing
  var staticSummary = this.data.summary;
  this.$('.summary-edit').html(staticSummary);
};

Template.summaryEditor.events({
  'keyup .summary-edit': function (e, t) {
    App.autosave(this._id, { $set: { summary: $(e.target).html() }});
  }
});
