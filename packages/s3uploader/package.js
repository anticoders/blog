
Package.describe({
  description : 'Upload your images to s3.',
  version     : '0.0.0',
  name        : 's3uploader',
});

Npm.depends({
  'aws-sdk': '2.1.14'
});

Package.onUse(function (api) {
  api.addFiles([
    'uploader.js'
  ], 'server');

  api.export('S3');
});
