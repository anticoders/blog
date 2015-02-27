
BlogPosts = new Mongo.Collection("blogPosts");

var aChunk = {
  'type'    : String,
  'content' : String,
};

BlogPosts.pattern = {
  '_id'       : String,
  'createdAt' : Date,
  'createdBy' : String,
  'chunks'    : [ aChunk ],
};
