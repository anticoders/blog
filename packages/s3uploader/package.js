
// maybe we could use slingshot instead?
// https://github.com/CulturalMe/meteor-slingshot

Package.describe({
  description : 'Upload your images to s3.',
  version     : '0.0.0',
  name        : 's3uploader',
});

Npm.depends({
  'aws-sdk': '2.1.14'
});

Package.onUse(function (api) {

  api.use([ 'mongo', 'livedata' ]);

  api.addFiles([
    'collections.js'
  ]);

  api.addFiles([
    'uploader.js'
  ], 'server');

  api.export('S3');
});
