App.doUpdate = _.debounce(function (postId, updates, done) {
  BlogPosts.update({ _id: postId }, { $set: updates }, function (err) {
    if (err) {
      App.error(err);
    }
    done(err);
  });
}, 500);
