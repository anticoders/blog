
Router.configure({
  layoutTemplate: 'master',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.route('/', {
  name  : 'landingPage',
  where : 'client',
});

Router.route('/login', {
  name  : 'login',
  where : 'client',

  action : function () {

    this.breadcrumb = [
      { title: 'home'  , link: Router.path('landingPage') },
      { title: 'login' , link: Router.path('about') },
    ];

    this.render();
  },
});

Router.route('/about', {
  name  : 'about',
  where : 'client',

  action : function () {

    this.breadcrumb = [
      { title: 'home'  , link: Router.path('landingPage') },
      { title: 'about' , link: Router.path('about') },
    ];

    this.render();
  },
});

Router.route('/blog', {
  name  : 'blogList',
  where : 'client',

  waitOn: function () {
    return Meteor.subscribe('blogPosts');
  },

  action: function () {

    this.breadcrumb = [
      { title: 'home' , link: Router.path('landingPage') },
      { title: 'blog' , link: Router.path('blogList') },
    ];

    this.render();
  },
});

Router.route('/blog/:_id', {
  name  : 'blogPost',
  where : 'client',

  waitOn: function () {
    return Meteor.subscribe('blogPosts');
  },

  data: function () {
    return BlogPosts.findOne({ _id: this.params._id });
  },

  action: function () {

    this.breadcrumb = [
      { title: 'home' , link: Router.path('landingPage') },
      { title: 'blog' , link: Router.path('blogList') },
      { title: 'post' , link: Router.path('blogPost', this.params) },
    ];

    this.render();
  },

});

Router.route('/edit/:_id', {
  name   : 'blogPostEdit',
  where  : 'client',
  
  waitOn: function () {
    return Meteor.subscribe('blogPosts');
  },

  onBeforeAction: function () {
    this.hint = new ReactiveVar("");
    this.next();
  },

  data: function () {
    return BlogPosts.findOne({ _id: this.params._id });
  },

  action: function () {

    this.breadcrumb = [
      { title: 'home' , link: Router.path('landingPage') },
      { title: 'blog' , link: Router.path('blogList') },
      { title: 'post' , link: Router.path('blogPost', this.params) },
      { title: 'edit' },
    ];

    this.render();
  },
});
