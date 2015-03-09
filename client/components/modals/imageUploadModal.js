Template.imageUploadModal.rendered = function () {
  var self = this;
  var pending = self.data.files.length;

  self.deferred = App.modalNotifyRendered(self.$('.ui.modal'), { delayShow: true });

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
});
