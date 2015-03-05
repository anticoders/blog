
Accounts.onCreateUser(function (options, user) {
  if (!options.profile) {
    options.profile = {};
  }
  if (!options.profile.avatarUrl) {
    options.profile.avatarUrl = getRandomAvatarUrl();
  }
  options.profile.joinedAt = moment().toDate();
  user.profile = options.profile;
  return user;
});

Accounts.getRandomAvatarUrl = function (gender) {
  var min = 0, max = 0;
  if (gender === 'male') {
    min = 1; max = 4;
  } else if (gender === 'female') {
    min = 5; max = 7;
  }
  var digits = '' + (min + Math.floor(Math.random() * (max - min + 1)));
  if (digits.length < 2) {
    digits = '0' + digits;
  }
  return Meteor.absoluteUrl('assets/images/avatars/default_' + digits + '.svg');
}
