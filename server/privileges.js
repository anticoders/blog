
BlogPosts.allow({
  insert: anyoneLoggedIn,
  remove: onlyTheOwner,
  update: onlyTheOwner,
});

// these documents can be only accessed with custom methods

Published.deny({
  insert: Utils.constant(true),
  remove: Utils.constant(true),
  update: Utils.constant(true),
});

function anyoneLoggedIn(userId) {
  return !!userId;
}

function onlyTheOwner(userId, doc) {
  return !!userId && doc.createdBy === userId;
}
