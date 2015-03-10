Template.sidebar.rendered = function () {

  // this is an ugly fix, but we need it because due to semantic-ui
  // incompatibility with jquery sortable plugin; briefly speaking
  // setting "overflow-x = hidden" on the "body" element prevents
  // the plugin from computing offsets properly

  this.$('.sidebar').sidebar({
    onVisible: function () {
      // we need to use both body and html to make sure
      // it also works with "the other" browsers
      $('body, html').addClass('overflow-x-hidden');
    },
    onHidden: function () {
      $('body, html').removeClass('overflow-x-hidden');
    },
  });
}

Template.sidebar.events({
  'click [data-action=toggle]': function (e, t) {
    t.$('.sidebar').sidebar('toggle');
  },
  'click [data-action=create]': function (e, t) {
    BlogPosts.create({
      createdBy: Meteor.userId(),
    }, function (err, postId) {
      if (err) {
        App.error(err);
      }
      Router.go('blogPostEdit', { _id: postId });
      //-----------------------------------------
      t.$('.sidebar').sidebar('toggle');
    });
  },
});

Template.sidebar.helpers({
  canCreate: function () {
    return Predicates.userIdCanCreateBlogPost(Meteor.userId());
  },
});
