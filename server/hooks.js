
BlogPosts.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = moment().toDate();
});
