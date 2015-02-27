Template.blogList.rendred = function () {

}

Template.blogList.helpers({
  listOfRecentPosts: function () {
    return BlogPosts.find({});
  },
});

Template.blogList.events({
  'click [data-action=create]': function () {
    BlogPosts.create({
      createdBy: 'someFakeUser',
    }, function (err, postId) {
      if (err) {
        App.error(err);
      }
      Router.go('blogPostEdit', { _id: postId });
    });
  }
});
