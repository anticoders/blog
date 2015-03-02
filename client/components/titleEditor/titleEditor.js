var doUpdate = _.debounce(function (postId, updates, done) {
  BlogPosts.update({ _id: postId }, { $set: updates }, done);
}, 500);

Template.titleEditor.rendered = function () {
  //we need to non-reactively add title to prevent updating DOM content during editing
  var staticTitle = this.data.title;
  this.$('.title-edit').html(staticTitle);
};

Template.titleEditor.events({
  'keyup .title-edit': function (e, t) {
    var controller = Iron.controller();
    var updates = {};
    var blogPost = Template.parentData();
    if (!blogPost) {
      throw new Meteor.Error('parentData for title editor should be a blog post');
    }
    if (controller && controller.hint) {
      controller.hint.set('saving ...');
    }
    updates['title'] = $(e.target).html();
    doUpdate(blogPost._id, updates, function () {
      if (controller && controller.hint) {
        controller.hint.set('saving done!');
      }
    });
  }
});