
S3 = {};

S3.uploads = new Mongo.Collection('s3uploads');

S3.uploads.deny({
  insert: always,
  remove: always,
  update: always,
});

function always () {
  return true;
}
