Template.blogPostEdit.created = function () {
  this.$lastFocused = null; //stores reference to last focused chunk input
};

Template.blogPostEdit.rendered = function () {

};

// we use rangyinputs here
Template.blogPostEdit.events({
  'focus textarea': function(e, tmpl) {
    tmpl.$lastFocused = $(e.currentTarget);
  },
  'blur textarea': function(e, tmpl){
    //tmpl.$lastFocused = null;
  },
  'click .icon-bold': function(e, tmpl) {
    if ( tmpl.$lastFocused && $.trim(tmpl.$lastFocused.getSelection().text) ) {
      tmpl.$lastFocused.surroundSelectedText('*', '*', 'select').
        keyup(); //triggers event to save changes to db
    }
  },
  'click .icon-italic': function(e, tmpl) {
    if ( tmpl.$lastFocused && $.trim(tmpl.$lastFocused.getSelection().text) ) {
      tmpl.$lastFocused.surroundSelectedText('**', '**', 'select').
        keyup(); //triggers event to save changes to db
    }
  },
  'click .icon-ulist': function(e, tmpl) {
    if ( tmpl.$lastFocused ) {
      var selectionStart = tmpl.$lastFocused.getSelection().start;
      var newLineIndex = tmpl.$lastFocused.val().lastIndexOf('\n', selectionStart);
      tmpl.$lastFocused.setSelection(newLineIndex + 1). //set caret at the beginning of the new line
        surroundSelectedText('* ', '', 'collapseToStart').
        keyup(); //triggers event to save changes to db
    }
  }
});
