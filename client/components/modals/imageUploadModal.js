
Template.imageUploadModal.created = function () {
  this.state = new ReactiveVar('waiting');
}

Template.imageUploadModal.rendered = function () {
  var self = this;
  var pending = self.data.files.length;

  self.modal = App.modalNotifyRendered(self.$('.ui.modal'), {
    dontShow: true,                // let us manually show the dialog when everything's ready
    selector: { close: ".close" }, // only "x" closes the modal
  });

  _.each(self.data.files, function (file, index) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = self.$('img[data-index=' + index + ']').get(0);
      image.onload = function () {
        pending -= 1;
        if (pending === 0) {
          // only show when all images are loaded and the size is known
          // otherwise the animations will break styling
          self.$('.ui.modal').modal('show');
        }
      }
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

Template.imageUploadModal.helpers({
  listOfImages: function () {
    return this.files;
  },
  isUploading: function () {
    return Template.instance().state.get() === 'uploading';
  },
  isWaiting: function () {
    return Template.instance().state.get() === 'waiting';
  },
});

Template.imageUploadModal.events({
  'click [data-action=upload]': function (e, t) {
    var self = this;
    t.state.set('uploading');
    Meteor.setTimeout(function () { // delay by 1/10 sec to let the UI update properly
      uploadImages(self.files, t, function (results) {
        t.modal.resolve(results);
      });
    }, 100);
  },
  'click [data-action=cancel]': function (e, t) {
    t.$('.ui.modal').modal('hide');
  },
});

function uploadImages (listOfFiles, template, callback) {
  var listOfResults = [];
  var pending = listOfFiles.length;
  _.each(listOfFiles, function (file, index) {
    var data = template.$('img[data-index=' + index + ']').get(0).src.split(',')[1];
    Meteor.call('uploadToS3', atob(data), file.type, function (err, key) {
      pending -= 1;
      if (err) {
        listOfResults.push({ error: err });
      } else {
        listOfResults.push({ value: key });
      }
      if (pending === 0) {
        callback && callback(listOfResults);
      }
    });
  });
};

