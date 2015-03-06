
Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { profile: 1, createdAt: 1 } });
});

Meteor.publish('blogPosts', function () {
  var self = this, handle;

  if (!self.userId) {
    // pump items from Published collection to client "blogPosts" sink
    handle = pump(self, Published.find({}), 'blogPosts');
  } else {
    handle = pump(self, BlogPosts.find({}), 'blogPosts');
  }

  self.onStop(function () {
    handle.stop();
  });

  Meteor.setTimeout(function () {
    self.ready();
  }, 1000);
});

function pump(sub, cursor, name) {
  return cursor.observeChanges({
    added: function (id, fields) {
      sub.added(name, id, fields);
    },
    changed: function (id, fields) {
      sub.changed(name, id, fields);
    },
    removed: function (id) {
      sub.removed(name, id);
    },
  });
}
