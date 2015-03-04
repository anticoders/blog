
Template.profileForm.rendered = function () {

  // initialize semantic ui form gears

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

};

