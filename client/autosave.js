
var cache = new Mongo.Collection(null); // no-name local collection

// TODO: eventually we could detect collisions by using this mechanism

BlogPosts.find({}).observeChanges({
  added: function (id, fields) {
    cache.insert(_.extend({ _id: id }, fields));
  },
  changed: function (id, fields) {
    cache.update({ _id: id }, { $set: fields });
  },
  remove: function (id) {
    cache.remove({_id: id});
  },
});

App.autosave = function autosave (id, modifier, callback) {
  if (!modifier.$set && !modifier.$push) {
    // for safety reasons
    return;
  }
  cache.update({ _id: id }, modifier);
  //----------------------------------
  var hint = App.getHintFunction();
  hint('saving ...');
  push(id, function () { hint(''); });
}

var push = _.debounce(function (blogPostId, callback) {
  var cached = cache.findOne({ _id: blogPostId });
  if (!cached) {
    return;
  }

  delete cached._id;

  BlogPosts.update({ _id: blogPostId }, { $set: cached }, function (err) {
    if (err) {
      App.error(err);
    }
    callback(err);
  });
}, 1000);
