
BlogPosts = new Mongo.Collection("blogPosts");

var aChunk = {
  'type'    : String,
  'content' : String,
};

BlogPosts.pattern = {
  '_id'       : String,
  'title'     : String,
  'createdAt' : Date,
  'createdBy' : String,
  'chunks'    : [ aChunk ],
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
    chunks    : [
      { type: 'text', content: Fake.paragraph(20) },
      { type: 'text', content: Fake.paragraph(20) },
    ],

  }, done);
};
