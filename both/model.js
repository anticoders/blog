
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
