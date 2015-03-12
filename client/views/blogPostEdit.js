"use strict";

Template.blogPostEdit.rendered = function () {

  var blogPostId = this.data._id;
  var indexBeforeSort = 0;
  var parentView = this.view;
  var $container = this.$('.chunks.container');

  // insert corresponding chunk editors to the DOM tree
  _.each(this.data.chunks, function (chunk) {
    if (!chunk) {
      chunk = { type: 'text', content: '[broken chunk]' };
    }
    Blaze.renderWithData(Template.chunkEditor, { blogPostId: blogPostId, chunk: chunk }, $container[0], parentView);
  });

  // init sortable plugin with sort events
  $container.sortable({
    handle: '.move.chunk.button',
    items: '> .chunk.editor',
    start: function(e, ui) {
      indexBeforeSort = ui.item.index();
    },
    stop: function(e, ui) {
      var indexAfterSort = ui.item.index();
      var chunkArray = BlogPosts.findOne({ _id: blogPostId }, {reactive: false}).chunks;
      Utils.moveInArray(chunkArray, indexBeforeSort, indexAfterSort);
      // TODO: make sure "hint" works here as well
      App.autosave(blogPostId, { $set: { chunks: chunkArray } });
    },
  });

};

Template.blogPostEdit.destroyed = function () {
  this.$('.chunks.container').sortable('destroy');
};

Template.blogPostEdit.events({

  'add.chunk': function(e, t, type) {
    var blogPostId = t.data._id;

    if (!type) {
      // TODO: notify user
      return;
    }

    var chunkToAdd = {
      type: type, content: ''
    };

    App.autosave(blogPostId, { $push: { chunks: chunkToAdd } });
    Blaze.renderWithData(Template.chunkEditor, {
      
      blogPostId : blogPostId,
      chunk      : chunkToAdd

    }, t.$('.chunks.container').get(0), t.view);
  },

  'click [data-action=remove]': function(e, t) {
    var blogPostId = t.data._id;
    App.prompt({
      question: 'Do you really want to remove selected chunk from database?',
    }).done(function () {
      var $editor = $(e.target).closest('.chunk.editor');
      var chunkArray = BlogPosts.findOne({_id: blogPostId}, { reactive: false }).chunks;
      var index = $editor.index();
      if (index === -1) {
        throw new Meteor.Error('chunk without an index may not be edited');
      }
      if (!chunkArray) {
        throw new Meteor.Error('array of chunks should exists for blog post');
      }
      chunkArray.splice(index, 1);
      App.autosave(blogPostId, { $set: { chunks: chunkArray} });
      Blaze.remove(Blaze.getView($editor[0]));
    });
  },

  'click [data-action=copy]': function (e, t) {
    var blogPostId = t.data._id;
    var $container = t.$('.chunks.container');
    var $editor    = $(e.target).closest('.chunk.editor');
    var chunks     = BlogPosts.findOne({ _id: blogPostId }, { reactive: false }).chunks;
    var index      = $editor.index();

    // copy the selected chunk
    chunks.splice(index, 0, chunks[index]);

    // save to database
    App.autosave(blogPostId, { $set: { chunks: chunks } });

    // create and append a new editor
    Blaze.renderWithData(Template.chunkEditor, { blogPostId: blogPostId, chunk: chunks[index] }, $container[0], $editor.next()[0], t.view);
  },
});

