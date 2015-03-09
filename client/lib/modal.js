
App.modal = function (name, data, options) {
  
  var view = Blaze.renderWithData(Template[name], data, $('.ui.modals').get(0));

  view._modal = options || {};

  var onHide = view._modal.onHide;

  view._modal.onHide = function () {
    // first call the user provided callback
    onHide && onHide.apply(this, arguments);

    // wait until all animations are done
    Meteor.setTimeout(function () {
      // and finally destroy the view
      Blaze.remove(view);
    }, 1000);
  }

  return view._modal.deferred = new $.Deferred();
}

App.modalNotifyRendered = function (node, options) {
  var view = findView();
  if (!view) {
    return;
  }

  options = options || {};

  $(node).modal(view._modal);

  if (!options.delayShow) {
    $(node).modal('show');
  }

  return view._modal.deferred;
}

function findView() {
  var view = Blaze.currentView;
  while (view) {
    if (view) {
      if (!!view._modal) {
        return view;
      }
    }
    view = view.parentView;
  }
}
