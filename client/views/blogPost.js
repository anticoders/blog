Template.blogPost.rendered = function () {

};

Template.blogPost.created = function () {

};

Template.blogPost.helpers({
  title: function () {
    return this.title || '[no title]';
  },
  createdAt: function () {
    return moment(this.date).format();
  },
  image: function () {
    if (this.image) {
      return this.image;
    }
    var author = Meteor.users.findOne({ _id: this.createdBy });
    console.log(author, this);
    if (author && author.profile && author.profile.avatarUrl) {
      return author.profile.avatarUrl;
    }
    return Meteor.absoluteUrl('assets/images/avatars/default_00.svg');  
  },
});
