Template.chunkEditor.rendered = function() {

  var chunkType = this.data && this.data.chunk && this.data.chunk.type || 'text';

  var editor  = CodeMirror(this.$('.chunk.editor')[0], initMode(chunkType));
  var content = new ReactiveVar();

  // watch changes of the current data context
  this.autorun(function () {
    content.set(Template.currentData().chunk.content);
  });

  // watch changes of the current chunk content
  this.autorun(function () {
    var doc = editor.getDoc(), cursor = null;
    var value = content.get();

    if (value === doc.getValue()) {
      console.log('no need to update');
      return;
    }

    // save the current cursor position
    cursor = doc.getCursor();

    doc.setValue(value);

    // try to restore the cursor position
    doc.setCursor(cursor);
  });

  this.editor = editor;
};

Template.chunkEditor.events({
  'keyup textarea': function (e, t) {
    var hint = App.getHintFunction();
    var updates = {};
    var index = t.$('.chunk.editor').index();
    if (index === -1) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    hint('saving ...');
    updates['chunks.' + index + '.content'] = t.editor.getValue();
    App.doUpdate(this.blogPostId, updates, function () {
      console.log('done updating');
      hint('');
    });
  },

  'dragover .chunk.editor': function (e, t) {
    e.originalEvent.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
    return false;
  },

  'drop .chunk.editor': function (e, t) {

    // prevent all default behavior
    e.preventDefault();

    var blogPost = Template.parentData();
    
    if (!blogPost) {
      throw new Meteor.Error('parentData for chunk editor should be a blog post');
    }

    console.log('image dropped');

    var listOfFiles = getListOfFiles(e.originalEvent);
    var listOfIds   = addPlaceholders(listOfFiles, this.blogPostId, this.chunk, t.editor.getDoc().getValue());

    App.modal('imageUploadModal', { files: listOfFiles }).then(function () {
      console.log('modal done ...');
    });

    /*uploadImages(e.originalEvent, function (listOfResults) {
      var content = t.$('textarea').val();
      _.each(listOfIds, function (id, index) {
        if (listOfResults[index].value) {
          content.replace(new RegExp('\[Uploading ' + id + '\]\(.*\)'), 'Uploaded as ' + listOfResults[index].value);
        } else {
          content.replace(new RegExp('\[Uploading ' + id + '\]\(.*\)'), listOfResults[index].error.toString());
        }
      });
      console.log('done uploading');
      console.log(listOfResults);
    });*/

    return false;
  },
  'click .chunk-remove': function(e, t){
    //TODO: display nice modal
    if ( !confirm('Do you really want to remove selected chunk from database?') ) return false;
    var hint = App.getHintFunction();
    var chunkArray = BlogPosts.findOne({_id: this.blogPostId}, {reactive: false}).chunks;
    var index = t.$('.chunk.editor').index();
    if (index === -1) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    if (!chunkArray) {
      throw new Meteor.Error('array of chunks should exists for blog post');
    }
    hint('saving ...');
    chunkArray.splice(index, 1); //removes chunk from array
    BlogPosts.update({ _id: this.blogPostId }, { $set: { chunks: chunkArray} }, function () {
      hint('');
    });
  }
});

function getListOfFiles (event) {
  var dt = event && event.dataTransfer;
  if (!dt || !dt.files) {
    return [];
  }
  return dt.files;
}

var uploadImages = function (listOfFiles, callback) {
  var listOfResults = [];
  var pending = listOfFiles.length;
  _.each(listOfFiles, function (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      Meteor.call('uploadToS3', e.target.result, file.type, function (err, key) {
        pending -= 1;
        if (err) {
          App.error(err);
          listOfResults.push({ error: err });
        } else {
          listOfResults.push({ value: key });
        }
        if (pending === 0) {
          callback && callback(listOfResults);
        }
      });
    };
    reader.readAsBinaryString(file);
  });
};

var addPlaceholders = function (listOfFiles, postId, chunk, content) {
  var listOfIds = [];
  var updates = {};
  if (chunk.index === undefined) {
    throw new Meteor.Error('chunk without an index may not be edited');
  }
  updates['chunks.' + chunk.index + '.content'] = content + '\n' + _.map(listOfFiles, function (file, index) {
    var id = Random.id();
    listOfIds.push(id);
    return '![Uploading ' + id + '](/path/to/some/file)';
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
