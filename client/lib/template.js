
Template.findInstance = function (condition) {
  var view = Blaze.currentView;
  while (view) {
    if (view && view._templateInstance) {
      if (!condition || condition(view._templateInstance)) {
        return view._templateInstance;
      }
    }
    if (view.originalParentView) {
      view = view.originalParentView;
    } else {
      view = view.parentView;
    }
  }
}
