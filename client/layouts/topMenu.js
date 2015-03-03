
Template.topMenu.created = function () {

}

Template.topMenu.rendered = function () {

  var container = this.$('.layout-top-menu-content')[0];

  container._uihooks = {
    insertElement: function (node, next) {
      $(node).addClass('animated bounceInLeft');
      container.insertBefore(node, next);
    },
    removeElement: function (node) {
      var $node  = $(node);
      var offset = $node.offset();
      var width  = $node.width();
      var height = $node.height();

      Meteor.defer(function () {
        $('body').append($node);

        $node
          .css('position', 'absolute')
          .css('margin', 0)
          .css('top', offset.top)
          .css('left', offset.left)
          .css('width', width)
          .css('height', height)
          // and animate ...
          .removeClass('bounceInLeft')
          .addClass('animated fadeOutRight')

      });

      Meteor.setTimeout(function () {
        $node.remove();
      }, 1000);
    },
  }

}

Template.topMenu.helpers({
  activeIf: function (name) {
    return Helpers.routeIs(name) ? 'active' : '';
  },
  activeUnless: function (name) {
    return Helpers.routeIs(name) ? '' : 'active';
  },
  hint: function () {
    var controller = Iron.controller();
    if (controller && controller.hint) {
      return controller.hint.get();
    }
  },
  year: function () {
    return moment().year();
  },
});
