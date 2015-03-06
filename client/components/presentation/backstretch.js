
Template.backstretch.created = function () {
  this.$index = new ReactiveVar(0);
}

Template.backstretch.rendered = function () {

  var self = this;
  var $node = self.$('*').first();

  if (!self.data) return;

  if (typeof self.data === 'object' && !self.data.images && !self.data.image) return;

  self.$spinner = $('<div class="ui active inverted dimmer"><div class="ui loader"></div></div>');

  $node.append(self.$spinner);

  if (typeof self.data === 'string') {
    $node.backstretch(self.data);
  } else if (typeof self.data === 'object') {
    $node.backstretch(self.data.images || self.data.image, self.data);
  }

  self.$backstretch = $node.data('backstretch');

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
    if (t.$spinner) {
      t.$spinner.transition('fade out', 500);
      Meteor.setTimeout(function () {
        t.$spinner.remove();
        t.$spinner = null;
      }, 500);
    }
  },
  'backstretch.before': function (e, t, instance, index) {
    t.$index.set(index);
  },
});
