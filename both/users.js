
Meteor.users._transform = function (data) {
  return new User(data);
};

// User

function User (data) {
  return _.extend(this, data);
}

User.prototype.getAvatarUrl = function () {
  if (this.profile && this.profile.avatarUrl) {
    return this.profile.avatarUrl;
  }
  return Meteor.absoluteUrl('assets/images/avatars/default_00.svg');
}

User.prototype.getFullName = function () {
  if (!this.profile) {
    return '[unknown]';
  }
  return this.profile.firstName + ' ' + this.profile.lastName;
}

