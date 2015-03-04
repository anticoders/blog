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
});

Template.blogList.events({
  'click [data-action=create]': function () {
    console.log('creating post');
    BlogPosts.create({
      createdBy: 'someFakeUser',
    }, function (err, postId) {
      if (err) {
        App.error(err);
      }
      Router.go('blogPostEdit', { _id: postId });
    });
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
