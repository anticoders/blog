Package.describe({
  description: 'Project NPM dependencies',
  version: '0.0.0',
  name: 'dependencies',
});

Npm.depends({
  'string': '3.0.0',
});

Package.onUse(function (api) {
  api.addFiles('dependencies.js', 'server');
  api.export('Dependencies');
});

