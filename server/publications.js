
Meteor.publish('blogPosts', function () {
  return BlogPosts.find({});
});
