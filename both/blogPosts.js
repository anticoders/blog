
BlogPosts = new Mongo.Collection("blogPosts", {
  transform: function (data) {
    return new BlogPost(data);
  },
});

var aChunk = {
  'type'    : String,
  'content' : String,
};

BlogPosts.pattern = {
  '_id'       : String,
  'title'     : String,
  'createdAt' : Date,
  'createdBy' : String,
  'summary'   : String,
  'chunks'    : [ aChunk ],
  'tags'      : [ String ],
};

BlogPosts.create = function (options, done) {
  var createdBy = options.createdBy;
  if (!createdBy && Meteor.isClient) {
    createdBy = Meteor.userId();
  }
  if (!createdBy) {
    throw new Meteor.Error('You must provide a valid createdBy option.');
  }
  return BlogPosts.insert({
    
    title     : Fake.sentence(8),
    createdAt : moment().toDate(),
    createdBy : createdBy,
    summary   : Fake.paragraph(8),
    tags      : [ Fake.word(8), Fake.word(4), Fake.word(4) ],
    chunks    : [
      { type: 'text', content: Fake.paragraph(16) },
      { type: 'text', content: Fake.paragraph(16) },
    ],

  }, done);
};

// BlogPost

function BlogPost (data) {
  return _.extend(this, data);
}

BlogPost.prototype.getImageUrl = function () {
  if (this.image) {
    return this.image;
  }
  var author = Meteor.users.findOne({ _id: this.createdBy });
  if (author && author.profile && author.profile.avatarUrl) {
    return author.profile.avatarUrl;
  }
  return Meteor.absoluteUrl('assets/images/avatars/default_00.svg');
}

BlogPost.prototype.getAuthorInfo = function () {
  var author = Meteor.users.findOne({ _id: this.createdBy });
  return (author ? author.getFullName() + ' on ' : '') + moment(this.createdAt).format('MMMM Do YYYY');
}

BlogPost.prototype.isModified = function () {
  if (!this.publishedAt) {
    return true;
  }
  return this.publishedAt < this.modifiedAt;
}
