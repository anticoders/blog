Template.blogPost.rendered = function () {

};

Template.blogPost.created = function () {

};

Template.blogPost.helpers({
  title: function () {
    return this.title || '[no title]';
  },
  image: function () {
    return this && this.getImageUrl();
  },
});
