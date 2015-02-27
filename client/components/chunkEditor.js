
var doUpdate = _.debounce(function (postId, updates, done) {
  BlogPosts.update({ _id: postId }, { $set: updates }, done);
}, 500);

Template.chunkEditor.events({
  'keyup textarea': function (e, t) {
    var controller = Iron.controller();
    var updates = {};
    var blogPost = Template.parentData();
    if (this.index === undefined) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    if (!blogPost) {
      throw new Meteor.Error('parentData for chunk editor should be a blog post');
    }
    if (controller && controller.hint) {
      controller.hint.set('saving ...');
    }
    updates['chunks.' + this.index + '.content'] = t.$('textarea').val();
    doUpdate(blogPost._id, updates, function () {
      if (controller && controller.hint) {
        controller.hint.set('saving done!');
      }
    });
  }
});
