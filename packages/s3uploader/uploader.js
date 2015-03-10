
var AWS    = Npm.require('aws-sdk');
var Future = Npm.require('fibers/future');

var s3 = null;
var config = {};
var configChanged = false;

Meteor.methods({
  'createS3upload': function (name, type, tags) {

    check(name, String);
    check(type, String);
    check(tags, [ String ]);

    if (!this.userId) {
      throw new Meteor.Error(403, 'You must be logged in to upload images');
    }

    return S3.uploads.insert({
      createdBy : this.userId,
      createdAt : moment().toDate(),
      state     : 'waiting',
      name      : name,
      type      : type,
      tags      : tags,
    });
  },

  'uploadToS3': function (uploadId, blob) {

    check(uploadId, String);

    var upload = S3.uploads.findOne({ _id: uploadId });

    if (!upload) {
      throw new Error(404, 'Invalid uploadId');
    }

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
    var key = uploadId;

    S3.uploads.update({ _id: uploadId }, { $set: { state: 'uploading' }});

    s3.putObject({
      ACL         : 'public-read',
      Key         : (config.prefix ? config.prefix + '/' : '') + key,
      Body        : new Buffer(blob, 'binary'),
      ContentType : upload.type,
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

    this.unblock();

    future.wait();

    S3.uploads.update({ _id: uploadId }, { $set: { state: 'done' }});
  },
});

S3.configure = function (options) {

  if (!options) {
    return;
  }

  config.accessKeyId     = options.accessKeyId;
  config.secretAccessKey = options.secretAccessKey;
  config.bucket          = options.bucket;
  config.prefix          = options.prefix;

  configChanged = true;
}

S3.allow = function () {
  return true;
}

Meteor.publish('s3uploads', function (selector) {
  selector = selector || {};
  selector.createdBy = this.userId;
  return S3.uploads.find(selector);
});
