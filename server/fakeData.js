
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
      username : 'example' + index,
      password : 'password',
      email    : 'example' + index + '@example',
      profile  : {
        avatarUrl : Accounts.getRandomAvatarUrl(maleOrFemale),
        joinedAt  : moment().toDate(),
        firstName : user.name,
        lastName  : user.surname,
        summary   : Fake.sentence(),
        biography : Fake.paragraph(5) + '\n\n' + Fake.paragraph(10),
      },
    });

  });

  _.each(usersIds, function (userId) {

    var postId1 = BlogPosts.create({ createdBy: userId });
    var postId2 = BlogPosts.create({ createdBy: userId });

    Meteor.call('publish', postId1);
    Meteor.call('publish', postId2);

  });

});

