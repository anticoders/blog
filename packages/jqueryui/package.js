
Package.describe({
  description : 'JQuery User Interface',
  version     : '1.11.3',
  name        : 'jqueryui',
});

Package.onUse(function (api) {

  api.use([ 'jquery' ]);

  api.addFiles([
    
    'core.js',
    'widget.js',
    'mouse.js',
    'resizable.js',
    'sortable.js',

  ], 'client');
});
