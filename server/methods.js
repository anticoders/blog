
var S = Dependencies.require('string');

Meteor.methods({
  publish: function (blogPostId) {
    check(blogPostId, String);

    // maybe only an admin user should be able to do this?
    
    // TODO: enable this later on (see fake data generation)
    //if (!this.userId) {
    //  throw new Meteor.Error(403, 'Access denied');
    //}

    var blogPost = BlogPosts.findOne({ _id: blogPostId });

    if (!blogPost) {
      throw new Meteor.Error(404, 'Post does not exist');
    }

    delete blogPost._id;

    // publish

    blogPost.year = moment(blogPost.createdAt).year();
    blogPost.slug = S(blogPost.title).slugify().s;

    if (Published.find({ _id: { $ne: blogPostId }, year: blogPost.year, slug: blogPost.slug }).count() > 0) {
      throw new Meteor.Error(400, 'This slug is already used; try changing your title ...');
    }

    Published.upsert({ _id: blogPostId }, { $set: blogPost });
    BlogPosts.update({ _id: blogPostId }, { $set: { publishedAt: moment().toDate() }});
  },

  unpublish: function (blogPostId) {
    check(blogPostId, String);

    // maybe only an admin user should be able to do this?
    
    if (!this.userId) {
      throw new Meteor.Error(403, 'Access denied');
    }

    Published.remove({ _id: blogPostId });
    BlogPosts.update({ _id: blogPostId }, { $unset: { publishedAt: 1 }});
  },
});

