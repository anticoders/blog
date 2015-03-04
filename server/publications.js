
Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { profile: 1, createdAt: 1 } });
});

Meteor.publish('blogPosts', function () {
  return BlogPosts.find({});
});
