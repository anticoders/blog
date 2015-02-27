
Router.configure({
  layoutTemplate: 'topMenu',
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
});

Router.route('/about', {
  name  : 'about',
  where : 'client',
});

Router.route('/blog', {
  name  : 'blogList',
  where : 'client',

  waitOn: function () {
    return Meteor.subscribe('blogPosts');
  }
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
});
