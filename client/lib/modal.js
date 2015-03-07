
App.modal = function (name, data, options) {
  
  var view = Blaze.renderWithData(Template[name], data, $('body').get(0));

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

App.modalNotifyRendered = function (node) {
  var view = findView();
  if (!view) {
    return;
  }

  $(node).modal(view._modal);
  $(node).modal('show');

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
