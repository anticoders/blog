
Template.backstretch.rendered = function () {

  var self = this;
  var $node = self.$('*').first();

  if (!self.data) return;

  if (typeof self.data === 'object' && !self.data.images && !self.data.image) return;

  /*require('spinner', function (Spinner) {
    self.spinner = new Spinner({
      width: 5,
      lines: 10,
      color: "#aaa",
    }).spin($node[0]);
  });*/

  if (typeof self.data === 'string') {
    $node.backstretch(self.data);
  } else if (typeof self.data === 'object') {
    $node.backstretch(self.data.images || self.data.image, self.data);
  }

  self.resize = function () {
    $node.backstretch('resize');
  }

  $(window).on('resize', self.resize);
}

Template.backstretch.destroyed = function () {
  $(window).off('resize', self.resize);
}

Template.backstretch.events({
  'backstretch.show div': function (e, t) {
    t.spinner && t.spinner.stop();
  }
});
