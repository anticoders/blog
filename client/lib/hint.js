
App.getHintFunction = function () {
  var controller = Iron.controller();
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
