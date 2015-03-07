Template.chunkEditor.rendered = function() {
  var that = this;
  var staticContent = this.data.chunk.content;
  this.$('textarea').val(staticContent);
  var chunkType = this.data && this.data.chunk && this.data.chunk.type || 'text';

  this.editorCodeMirror = CodeMirror.fromTextArea(this.find('textarea'),initMode(chunkType));
  window.qweqwe = this.editorCodeMirror;
};

Template.chunkEditor.events({
  'keyup textarea': function (e, t) {
    var hint = App.getHintFunction();
    var updates = {};
    var index = t.$('.chunkEditor').index();
    if (index === -1) {
      throw new Meteor.Error('chunk without an index may not be edited');
    }
    hint('saving ...');
    updates['chunks.' + index + '.content'] = t.editorCodeMirror.getValue();
    App.doUpdate(this.blogPostId, updates, function () {
      hint('');
    });
  },
  'dragover .chunkEditor': function (e, t) {
    e.originalEvent.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
    return false;
  },
  'drop .chunkEditor': function (e, t) {
    var blogPost = Template.parentData();
    if (!blogPost) {
      throw new Meteor.Error('parentData for chunk editor should be a blog post');
    }
    var listOfIds = addPlaceholders(e.originalEvent, this.blogPostId, this.chunk, t.$('textarea').val());
    uploadImages(e.originalEvent, function (listOfResults) {
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
    });
    e.preventDefault();
    return false;
  },
  'click .chunk-remove': function(e, t){
    //TODO: display nice modal
    if ( !confirm('Do you really want to remove selected chunk from database?') ) return false;
    var hint = App.getHintFunction();
    var chunkArray = BlogPosts.findOne({_id: this.blogPostId}, {reactive: false}).chunks;
    var index = t.$('.chunkEditor').index();
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

var uploadImages = function (event, callback) {
  var dt = event.dataTransfer;
  if (!dt || !dt.files) {
    return callback && callback([]);
  }
  var listOfResults = [];
  var pending = dt.files.length;
  _.each(dt.files, function (file) {
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

var addPlaceholders = function (event, postId, chunk, content) {
  var dt = event.dataTransfer;
  if (!dt || !dt.files) {
    return;
  }
  var listOfIds = [];
  var updates = {};
  if (chunk.index === undefined) {
    throw new Meteor.Error('chunk without an index may not be edited');
  }
  updates['chunks.' + chunk.index + '.content'] = content + '\n' + _.map(dt.files, function (file, index) {
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