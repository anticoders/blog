Template.landingPage.rendered = function () {
  this.$('.landing.page.section').hide();
  this.$('.landing.page.section').transition('slide left', 500).transition('jiggle', 500);
}

Template.landingPage.helpers({
  lorem: function () {
    return Fake.paragraph(20);
  },
  listOfSlides: function () {
    return [
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
    ];
  },
  spy: function () {
    console.log(this);
  }
});

Template.landingPage.events({
  'swipe2 .carousel': function (e, t, s, d) {
    console.log('swipe', e, t, s, d);
  }
});
