Template.chunkEditor.rendered = function() {

  var chunkType = this.data && this.data.chunk && this.data.chunk.type || 'text';

  this.editor = CodeMirror(this.$('.chunk.editor')[0], initMode(chunkType));
  this.editor.getDoc().setValue(this.data.chunk.content);
};

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
    var listOfIds   = addPlaceholders(listOfFiles, this.blogPostId, this.chunk, t.editor.getDoc().getValue());

    App.modal('imageUploadModal', {

      files: listOfFiles

    }).done(function (listOfResults) {

      var blogPost = BlogPosts.findOne({ _id: blogPostId });
      var listOfErrors = [];
      var updates = {};

      _.each(listOfResults, function (result, index) {
        var re = new RegExp('\!\\[Uploading ' + listOfIds[index] + '\\]\(.*\)', 'g');
        if (result.error) {
          listOfErrors.push({
            name  : listOfFiles[index].name,
            error : result.error,
          });
        }
        if (result.value) {
          // by replacing the content of all chunks, we get away with knowing the correct index
          // (which may be problematic in some edge case scenarios)
          _.each(blogPost.chunks, function (chunk) {
            chunk.content = chunk.content.replace(re,
              '![' + listOfFiles[index].name + '](' + Meteor.settings.public.s3uploadsPrefix + result.value + ')');
          });
        }
      });

      // perform the update ...
      BlogPosts.update({ _id: blogPostId }, { $set: { chunks: blogPost.chunks } });

      if (listOfErrors.length > 0) {
        App.error({
          title       : 'Something went wrong with the upload',
          description : 'The following files could not be uploaded:\n\n- ' + _.pluck(listOfErrors, 'name').join('\n- '),
          //------------------------------------------------------------------------------------------------------------
          error       : listOfErrors[0].error, // TODO: better error message
        });
      }

    }).fail(function (err) {
      App.error(err);
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

var addPlaceholders = function (listOfFiles, postId, chunk, content) {
  var listOfIds = [];
  var updates = {};
  if (chunk.index === undefined) {
    throw new Meteor.Error('chunk without an index may not be edited');
  }
  updates['chunks.' + chunk.index + '.content'] = content + '\n' + _.map(listOfFiles, function (file, index) {
    var id = Random.id();
    // TODO: use to original image size ...
    listOfIds.push(id);
    return '![Uploading ' + id + '](http://fakeimg.pl/350x200/282828/eeeeee?text=uploading ...)';
  }).join('\n');
  BlogPosts.update({ _id: postId }, { $set: updates });
  return listOfIds;
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
