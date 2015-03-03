Template.blogList.rendred = function () {

}

Template.blogList.helpers({
  listOfRecentPosts: function () {
    return BlogPosts.find({});
  },
  title: function () {
    return this.title || '[no title]';
  },
});

Template.blogList.events({
  'click [data-action=create]': function () {
    console.log('creating post');
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
