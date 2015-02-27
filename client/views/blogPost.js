Template.blogPost.rendred = function () {

}

Template.blogPost.helpers({
  title: function () {
    return this.title || '[no title]';
  },
  createdAt: function () {
    return moment(this.date).format();
  },
});
