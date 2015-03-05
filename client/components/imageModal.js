
Template.imageModal.rendered = function () {

  console.log(this.data);

  App.showModal(this.$('.ui.modal'));
}
