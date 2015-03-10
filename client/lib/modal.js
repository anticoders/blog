
App.modal = function (name, data, options) {
  var deferred = new $.Deferred();
  var view = Blaze.renderWithData(Template[name], data, $('.ui.modals').get(0));

  options = options || {};
  view._modal = _.extend({}, options); // do not overwrite the original object

  var events = [ 'onShow', 'onVisible', 'onHide', 'onHidden', 'onApprove', 'onDeny' ];

  _.each(events, function (name) {
    view._modal[name] = function () {
      if (name === 'onHidden') {
        Meteor.defer(function () {
          Blaze.remove(view);
        });
      }
      return options[name] && options[name].call(this, deferred);
    }
  });
  view._modal.deferred = deferred;
  return deferred.promise();
}

App.modalNotifyRendered = function (node, options) {
  var view = findView();

  if (!view) {
    return;
  }

  options = options || {};

  // allow the template to provide some defaults
  _.defaults(view._modal, options);

  $(node).modal(view._modal);
  if (!options.dontShow) {
    $(node).modal('show');
  }

  view._modal.deferred.always(function () {
    Meteor.setTimeout(function () {
      // we need this delay in case some other modal pops-up
      $(node).modal('hide');
    }, 50);
  });

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
