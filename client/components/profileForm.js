
Template.profileForm.rendered = function () {

  // initialize semantic ui form gears

  var self = this;

  this.$('.ui.checkbox').checkbox();

  this.$('.dropdown').dropdown();

  this.$('.ui.form').form({
    firstName: {
      identifier  : 'firstName',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your first name'
        }
      ]
    },
    lastName: {
      identifier  : 'lastName',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter your last name'
        }
      ]
    },
    motto: {
      identifier  : 'motto',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please write your motto'
        }
      ]
    },
    biography: {
      identifier  : 'biography',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please write your biography'
        }
      ]
    },
    gender: {
      identifier  : 'gender',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please select a gender'
        }
      ]
    },
    username: {
      identifier : 'username',
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a username'
        }
      ]
    },
  });

  this.autorun(function () {
    var data = Template.currentData();
    self.$('.ui.form').form('set values', data);
  });

};

