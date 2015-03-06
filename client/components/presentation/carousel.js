Template.carousel.rendered = function () {

  var self = this;

  self.$('.carousel').slick({
    //dots         : true,
    arrows        : false,
    infinite      : true,
    autoplay      : true,
    lazyLoad      : 'ondemand',
    autoplaySpeed : 5000,
    //appendArrows : '.carousel',
  });

  self.$('.carousel').on('swipe', function () {
    // ...
  });

}
