Template.addChunkButton.rendered = function () {
  this.$(".ui.dropdown").dropdown();
}

Template.addChunkButton.events({
  'click [data-value]': function (e, t) {
    t.value = $(e.target).data('value');
  },
  'click [data-action=trigger]': function (e, t) {
    $(e.target).trigger('add.chunk', [ t.value ]);
    return false; // stop propagation
  },
});
