
Template.blogPost.helpers({
  title: function () {
    return this.title || '[no title]';
  },
  image: function () {
    return this && this.getImageUrl && this.getImageUrl();
  },
  canEdit: function () {
    return Predicates.userIdCanEditBlogPost(Meteor.userId(), this);
  },
  column: function () {
    return Utils.wordify(this.size || 16) + ' wide column';
  },
  highlight: function (code) {
    return new Spacebars.SafeString(hljs.highlightAuto(code).value);
  },
});
