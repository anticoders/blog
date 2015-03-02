
var AWS    = Npm.require('aws-sdk');
var Future = Npm.require('fibers/future');

var s3 = null;
var config = {};
var configChanged = false;

Meteor.methods({
  'uploadToS3': function (blob, type) {

    if (configChanged) {    
      s3 = new AWS.S3({
        accessKeyId     : config.accessKeyId,
        secretAccessKey : config.secretAccessKey,
        apiVersion      : '2006-03-01',
        params: {
          Bucket: config.bucket,
        }
      });
      configChanged = false;
    }

    if (!s3) {
      throw new Meteor.Error(500, 'You must configure s3 first.');
    }

    var future = new Future();
    var user = Meteor.users.findOne({_id: this.userId});

    if (!S3.allow(user)) {
      throw new Meteor.Error(403, 'You are not allowed to upload images.');
    }

    // TODO: use userId to customize the key
    var key = Random.id();

    s3.putObject({
      ACL         : 'public-read',
      Key         : key,
      Body        : new Buffer(blob, 'binary'),
      ContentType : type,
      Metadata    : {
        'createdAt'   : moment().format(),
        'description' : 'uploaded by ' + this.userId,
      },
    }, function (err) {
      if (err) {
        future['throw'](err);
      } else {
        future['return'](key);
      }
    });

    return future.wait();
  },
});

S3 = {};

S3.configure = function (options) {

  if (!options) {
    return;
  }

  config.accessKeyId     = options.accessKeyId;
  config.secretAccessKey = options.secretAccessKey;
  config.bucket          = options.bucket;

  configChanged = true;
}

S3.allow = function () {
  return true;
}

