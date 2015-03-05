Template.blogList.rendred = function () {

}

Template.blogList.helpers({
  listOfRecentPosts: function () {
    return BlogPosts.find({});
  },
  title: function () {
    return this.title || '[no title]';
  },
  summary: function () {
    return this.summary || brief(this.chunks[0].content, 512);
  },
  image: function () {
    return this && this.getImageUrl && this.getImageUrl();
  },
  pathForThisPost: function () {
    if (this.slug && this.year) {
      return Router.path('published', this);
    }
    return Router.path('blogPost', this);
  },
});

Template.blogList.events({
  'click [data-action=create]': function () {
    BlogPosts.create({
      createdBy: Meteor.userId(),
    }, function (err, postId) {
      if (err) {
        App.error(err);
      }
      Router.go('blogPostEdit', { _id: postId });
    });
  },
  'click [data-action=publish]': function () {
    Meteor.call('publish', this._id);
  },
  'click [data-action=unpublish]': function () {
    Meteor.call('unpublish', this._id);
  },
});

function brief(text, length) {
  var brief = "";
  text = text.split(' ');
  while (text.length > 0 && brief.length < length) {
    brief += ' ' + text.shift();
  }
  if (text.length > 0) {
    brief += ' ...';
  }
  return brief;
}
