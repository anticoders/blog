
Router.configure({
  defaultLayout: 'empty',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.route('/', {
  name  : 'landingPage',
  where : 'client',
});

Router.route('/blog', {
  name  : 'blogList',
  where : 'client',

});

Router.route('/blog/:_id', {
  name  : 'blogPost',
  where : 'client',
});

Router.route('/edit/:_id', {
  name  : 'blogPostEdit',
  where : 'client',
});
