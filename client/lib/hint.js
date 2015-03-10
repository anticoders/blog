
App.getHintFunction = function () {
  var controller;
  try {
    controller = Iron.controller();
  } catch (err) {
    return function () {};
  }
  return function hint(text) {
    if (controller && controller.hint) {
      if (arguments.length > 0) {
        controller.hint.set(text);
      } else {
        return controller.hint.get();
      }
    }
  }
}

App.hint = function () {
  return App.getHintFunction().apply({}, arguments);
}
