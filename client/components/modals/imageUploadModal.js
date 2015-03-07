Template.imageUploadModal.rendered = function () {
  var self = this;

  self.deferred = App.modalNotifyRendered(self.$('.ui.modal'));

  _.each(self.data.files, function (file, index) {
    var reader = new FileReader();
    reader.onload = function (e) {

      var image = self.$('img[data-index=' + index + ']').get(0);

      image.onload = function () {
        // TODO: make this work!
        self.$('.ui.modal').modal('refresh');
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
});
