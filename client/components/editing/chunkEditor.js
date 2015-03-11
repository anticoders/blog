"use strict";

Template.chunkEditor.rendered = function() {

  var chunkType  = this.data && this.data.chunk && this.data.chunk.type || 'text';
  var blogPostId = this.data.blogPostId;
  var editor     = CodeMirror(this.$('.chunk.editor > .resizable')[0], initMode(chunkType));
  var self       = this;
  var $wrapper   = this.$('.chunk.editor'); 
  var $grid      = $wrapper.closest('.ui.grid');

  this.$('.chunk.editor > .resizable').resizable({
    grid    : [ 1, 1000 ], // find a better way to block vertical movement
    handles : {
      e: '.ui.resize.button'
    },
    resize  : function (e, ui) {
      var width = Math.ceil(16 * ui.size.width / $grid.width());
      if (width < 1) {
        width = 1;
      }
      if (width > 16) {
        width = 16;
      }
      $wrapper[0].className = $wrapper[0].className.replace(/\w+ wide column/, wordify(width) + ' wide column');
      ui.element.css('width', '').css('height', '');
      editor.refresh();
    },
  });

  // initialize editor with the current chunk value
  editor.getDoc().setValue(this.data.chunk.content);

  /**
   * Update chunk content in both editor and database.
   * @param {string} content
   */
  this.update = function update (content) {
    // update database
    var index = self.$('.chunk.editor').index(), updates = {};

    updates['chunks.' + index + '.content'] = content;
    App.autosave(blogPostId, { $set: updates });

    // update the editor
    var doc = editor.getDoc(), cursor = null;

    if (content === doc.getValue()) {
      return;
    }
    cursor = doc.getCursor();
    doc.setValue(content);
    doc.setCursor(cursor);
  };

  // an observer to watch the status of currently uploaded documents
  this.uploads = S3.uploads.find({ state: 'done', tags: 'blogPostId:' + blogPostId }).observeChanges({
    added: function (id, fields) {
      var re = new RegExp('\!\\[Uploading ' + id + '\\]\(.*\)', 'g');
      var content = editor.getDoc().getValue();
      //---------------------------------------
      content = content.replace(re,
        '![' + fields.name + '](' + Meteor.settings.public.s3uploadsPrefix + id + ')');

      self.update(content);
    }
  });

  // make the editor accesible for the others
  this.editor = editor;
};

Template.chunkEditor.destroyed = function () {
  this.uploads.stop();
}

Template.chunkEditor.events({

  'keyup .chunk.editor': function (e, t) {
    t.update(t.editor.getValue());
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

/**
 * Safely extract the list of files from the given drop event.
 */
function getListOfFiles (event) {
  var dt = event && event.dataTransfer;
  if (!dt || !dt.files) {
    return [];
  }
  return dt.files;
}

/**
 * Initialize uploads and put placeholders into the chunk content.
 */
function addPlaceholders (listOfFiles, blogPostId, template, cb) {

  App.all(listOfFiles, function (file, cb) {
    Meteor.call('createS3upload', file.name, file.type, [ 'blogPostId:' + blogPostId ], cb);

  }).done(function (listOfIds) {

    var index   = template.$('.chunk.editor').index();
    var content = template.editor.getDoc().getValue();

    content += '\n' + _.map(listOfIds, function (id) {
      // TODO: use to original image size ...
      return '![Uploading ' + id + '](http://fakeimg.pl/350x200/282828/eeeeee?text=uploading ...)';
    }).join('\n');

    template.update(content);

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

var words = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

function wordify(number) {
  return words[number];
}

