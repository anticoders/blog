
if (!Meteor.settings.createFakeData) {
  return;
}

Meteor.startup(function () {

  if (Meteor.users.find().count() > 0) {
    return;
  }

  var usersIds = [];

  _(3).times(function (index) {

    var user = Fake.user();
    var maleOrFemale = Fake.fromArray([ 'male', 'female' ]);

    usersIds[index] = Accounts.createUser({
      username : 'fake_' + index,
      password : 'password',
      email    : 'fake_' + index + '@example',
      profile  : {
        firstName : user.name,
        lastName  : user.surname,
        gender    : maleOrFemale,
        motto     : Fake.sentence(),
        biography : Fake.paragraph(5) + '\n\n' + Fake.paragraph(10),
      },
    });

  });

  _.each(usersIds, function (userId) {

    BlogPosts.create({ createdBy: userId });
    BlogPosts.create({ createdBy: userId });

  });

});

