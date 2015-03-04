Template.landingPage.rendered = function () {
  
};

Template.landingPage.helpers({
  lorem: function (numberOfSetences) {
    return Fake.paragraph(numberOfSetences || 20);
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
  authors: function () {
    return Meteor.users.find();
  },
});

Template.landingPage.events({
  'swipe2 .carousel': function (e, t, s, d) {
    console.log('swipe', e, t, s, d);
  }
});
