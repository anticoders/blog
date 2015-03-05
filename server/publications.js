
Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { profile: 1, createdAt: 1 } });
});

Meteor.publish('blogPosts', function () {
  var self = this, handle;

  if (!self.userId) {

    // pipe items from Published collection to client "blogPosts" sink

    handle = Published.find({}).observeChanges({
      added: function (id, fields) {
        self.added('blogPosts', id, fields);
      },
      changed: function (id, fields) {
        self.changed('blogPosts', id, fields);
      },
      removed: function (id) {
        self.removed('blogPosts', id);
      },
    });

    self.ready();

    self.onStop(function () {
      handle.stop();
    });

  } else {
    return BlogPosts.find({});
  }
});
