"use strict";

Template.blogPostEdit.rendered = function () {

  var blogPostId = this.data._id;
  var indexBeforeSort = 0;
  var parentView = this.view;
  var $container = this.$('.chunks-container');

  // insert corresponding chunk editors to the DOM tree
  _.each(this.data.chunks, function (chunk) {
    Blaze.renderWithData(Template.chunkEditor, { blogPostId: blogPostId, chunk: chunk }, $container[0], parentView);
  });

  // init sortable plugin with sort events
  $container.sortable({
    axis: 'y',
    handle: '.sort-chunk-handler',
    items: '> .chunk.editor',
    start: function(e, ui) {
      indexBeforeSort = ui.item.index();
    },
    stop: function(e, ui) {
      var indexAfterSort = ui.item.index();
      var chunkArray = BlogPosts.findOne({ _id: blogPostId }, {reactive: false}).chunks;
      Utils.moveInArray(chunkArray, indexBeforeSort, indexAfterSort);
      BlogPosts.update({ _id: blogPostId }, { $set: { chunks: chunkArray } });
    },
  });

};

Template.blogPostEdit.destroyed = function () {
  this.$('.chunks-container').sortable('destroy');
};

Template.blogPostEdit.events({
  'click [data-action=addChunk]': function(e, t) {
    var blogPostId = t.data._id;
    var chunkToAdd = {
      type: 'text', content: ''
    };
    BlogPosts.update({ _id: blogPostId }, { $push: { chunks: chunkToAdd } });
    Blaze.renderWithData(Template.chunkEditor, {
      
      blogPostId : blogPostId,
      chunk      : chunkToAdd

    }, t.$('.chunks-container').get(0), t.view);
  },
  'click [data-action=removeChunk]': function(e, t) {
    // TODO: display nice modal
    if ( !confirm('Do you really want to remove selected chunk from database?') ) return false;
    var $editor = $(e.target).closest('.chunk.editor');
    var chunkArray = BlogPosts.findOne({_id: this.blogPostId}, { reactive: false }).chunks;
    var index = $editor.index();
    if (index === -1) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    if (!chunkArray) {
      throw new Meteor.Error('array of chunks should exists for blog post');
    }
    chunkArray.splice(index, 1);
    BlogPosts.update({ _id: this.blogPostId }, { $set: { chunks: chunkArray} });
    Blaze.remove(Blaze.getView($editor[0]));
  },
});
