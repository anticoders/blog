
BlogPosts.before.update(function (userId, doc, fieldNames, modifier, options) {

  if (fieldNames.length === 1 && fieldNames[0] === 'publishedAt') {
    // do not use a new timestamp if we are only publishing
    return;
  }

  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = moment().toDate();
});
