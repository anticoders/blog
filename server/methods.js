Meteor.methods({
  publish: function (blogPostId) {
    check(blogPostId, String);

    // maybe only an admin user should be able to do this?
    
    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    var blogPost = BlogPosts.findOne({ _id: blogPostId });

    if (!blogPost) {
      throw new Meteor.Error(404, 'Post does not exist');
    }

    delete blogPost._id;

    // publish

    Published.upsert({ _id: blogPostId }, { $set: blogPost });
    BlogPosts.update({ _id: blogPostId }, { $set: { publishedAt: moment().toDate() }});
  },
});
