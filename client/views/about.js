Template.about.rendered = function () {

}

Template.about.helpers({
  lorem: function () {
    return Fake.paragraph(20);
  },
  bio: function () {
    return Fake.paragraph(5) + '\n\n' + Fake.paragraph(10);
  },
  name: function () {
    return Fake.user().fullname;
  },
  motto: function () {
    return Fake.sentence();
  },
  members: function () {
    return [ { index: 1 }, { index: 8 }, { index: 7 } ];
  },
});
