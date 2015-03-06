Template.sidebar.events({
  'click [data-action=toggle]': function (e, t) {
    t.$('.sidebar').sidebar('toggle');
  },
  'click [data-action=create]': function (e, t) {
    BlogPosts.create({
      createdBy: Meteor.userId(),
    }, function (err, postId) {
      if (err) {
        App.error(err);
      }
      Router.go('blogPostEdit', { _id: postId });
      //-----------------------------------------
      t.$('.sidebar').sidebar('toggle');
    });
  },
});

Template.sidebar.helpers({
  canCreate: function () {
    return Predicates.userIdCanCreateBlogPost(Meteor.userId());
  },
});
