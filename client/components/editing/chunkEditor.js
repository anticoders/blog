Template.chunkEditor.rendered = function() {

  var chunkType  = this.data && this.data.chunk && this.data.chunk.type || 'text';
  var blogPostId = this.data.blogPostId;
  var editor     = CodeMirror(this.$('.chunk.editor')[0], initMode(chunkType));
  var self       = this;

  this.editor = editor;
  this.editor.getDoc().setValue(this.data.chunk.content);

  this.uploads = S3.uploads.find({ state: 'done', tags: 'blogPostId:' + blogPostId }).observeChanges({
    added: function (id, fields) {

      var re = new RegExp('\!\\[Uploading ' + id + '\\]\(.*\)', 'g');
      var content = editor.getDoc().getValue();

      content = content.replace(re, '![' + fields.name + '](' + Meteor.settings.public.s3uploadsPrefix + id + ')');

      var index = self.$('.chunk.editor').index();
      var updates = {};

      // perform all updates
      updates['chunks.' + index + '.content'] = content;
      BlogPosts.update({ _id: blogPostId }, { $set: updates });
      setValueAndKeepCursor(editor, content);
    }
  });

};

Template.chunkEditor.destroyed = function () {
  this.uploads.stop();
}

Template.chunkEditor.events({

  'keyup .chunk.editor': function (e, t) {
    var hint = App.getHintFunction();
    var updates = {};
    var index = t.$('.chunk.editor').index();
    if (index === -1) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    hint('saving ...');
    updates['chunks.' + index + '.content'] = t.editor.getValue();
    App.doUpdate(this.blogPostId, updates, function () {
      hint('');
    });
  },

  'dragover .chunk.editor': function (e, t) {
    e.originalEvent.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
    return false;
  },

  'drop .chunk.editor': function (e, t) {
    e.preventDefault(); // prevent all default actions

    var blogPostId  = this.blogPostId;
    var listOfFiles = getListOfFiles(e.originalEvent);

    addPlaceholders(listOfFiles, blogPostId, t, function (err, listOfIds) {

      App.modal('imageUploadModal', {
        files : listOfFiles,
        IDs   : listOfIds,
      }).done(function (results) {
        // display some message?
        
      }).fail(function (err) {
        App.error(err);
      });

    });

    return false;
  },
});

function getListOfFiles (event) {
  var dt = event && event.dataTransfer;
  if (!dt || !dt.files) {
    return [];
  }
  return dt.files;
}

var addPlaceholders = function (listOfFiles, blogPostId, template, cb) {

  App.all(listOfFiles, function (file, cb) {
    Meteor.call('createS3upload', file.name, file.type, [ 'blogPostId:' + blogPostId ], cb);

  }).done(function (listOfIds) {

    var editor  = template.editor;
    var index   = template.$('.chunk.editor').index();
    var updates = {};
    var content = editor.getDoc().getValue();

    content += '\n' + _.map(listOfIds, function (id) {
      // TODO: use to original image size ...
      return '![Uploading ' + id + '](http://fakeimg.pl/350x200/282828/eeeeee?text=uploading ...)';
    }).join('\n');

    // perform all updates
    updates['chunks.' + index + '.content'] = content;
    BlogPosts.update({ _id: blogPostId }, { $set: updates });
    setValueAndKeepCursor(editor, content);

    cb(null, listOfIds);

  }).fail(function (err) {
    App.error(err).always(function () {
      cb(err);
    });
  });
};

function initMode (type) {
  var options = {
    dragDrop: false
  };

  if (type === 'text') {
    options.mode = 'null';
    options.theme = 'default'; // or ambiance
    options.lineWrapping = true;
    options.lineNumbers = false;
    options.addModeClass = true;

  } else if (type === 'javascript') {
    options.mode = 'javascript';
    options.theme = 'ambiance';
    options.lineWrapping = false;
    options.lineNumbers = true;
    options.addModeClass = false;
  }

  return options;
}

function setValueAndKeepCursor (editor, value) {
  var doc = editor.getDoc(), cursor = null;

  if (value === doc.getValue()) {
    return;
  }

  // save the current cursor position
  cursor = doc.getCursor();

  doc.setValue(value);

  // try to restore the cursor position
  doc.setCursor(cursor);
}
