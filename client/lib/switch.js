
Template.registerHelper('case', new Template('case', function () {
  var closestSwitch = findClosestSwitch(this);
  
  if (!closestSwitch) {
    throw new Error('"case" helper can be only used within a switch');
  }
  
  closestSwitch.__addCase___(Template.currentData(this),
    this.templateContentBlock && this.templateContentBlock.renderFunction);

  return null; // do not render anything, just register the render function
}));

Template.registerHelper('switch', new Template('switch', function () {

  var defaultFunc = this.elseContentBlock && this.elseContentBlock.renderFunction;
  var parentView  = this.parentView;
  var switchVar   = new ReactiveVar();
  var allCases    = {};
  var theSwitch   = this;

  if (parentView.__isTemplateWith) {
    parentView = parentView.parentView;
  }

  var dynamicContent = new Blaze.View('switch.content', function () {
    var contentFunc = allCases[switchVar.get()] || defaultFunc;
    return contentFunc ? contentFunc() : null;
  });

  dynamicContent.onViewCreated(function () {
    // adjust the parent view
    this.originalParentView = this.parentView;
    this.parentView = parentView;
    //---------------------------
    this.autorun(function () {
      switchVar.set(Template.currentData(theSwitch));
    }, this.parentView);
  });

  var cases = new Blaze.View('switch', this.templateContentBlock.renderFunction);

  cases.__addCase___ = function (name, contentFunc) {
    allCases[name] = contentFunc;
  };

  return [ cases, dynamicContent ];
}));

findClosestSwitch = function (view) {
  while (view) {
    if (view.name === 'switch') {
      return view;
    } else {
      view = view.parentView;
    }
  }
  return null;
};

/* Alternative implementation using Blaze.If */

/*

Template.registerHelper('case', new Template('case', function () {

  var theCase = this;
  var closestSwitch = findClosestSwitch(theCase);

  if (!closestSwitch) {
    throw new Error('"case" helper can be only used within a switch');
  }

  var view = new Blaze.If(function () {
    return Template.currentData(theCase) === closestSwitch.__switchVar__.get();
  }, this.templateContentBlock.renderFunction);

  // adjust parent view ...
  view.onViewCreated(function () {
    this.originalParentView = this.parentView;
    this.parentView = closestSwitch.parentView;
  });

  return view;
}));

Template.registerHelper('switch', new Template('switch', function () {

  var parentView  = this.parentView;
  var switchVar   = new ReactiveVar();
  var theSwitch   = this;

  if (parentView.__isTemplateWith) {
    parentView = parentView.parentView;
  }

  var view  = new Blaze.View('switch', this.templateContentBlock.renderFunction);

  view.onViewCreated(function () {

    // make sure the data context is correct
    this.originalParentView = this.parentView;
    this.parentView = parentView;

    // keep switchVar updated
    this.autorun(function () {
      switchVar.set(Template.currentData(theSwitch));
    }, this.parentView);
  });

  view.__switchVar__ = switchVar;

  return view;
}));

*/
