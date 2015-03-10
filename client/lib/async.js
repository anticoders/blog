
App.all = function (array, options, perform) {

  if (typeof options === 'function') {
    perform = options; options = {};
  }

  var deferred = new $.Deferred;
  var pending  = array.length;
  var working  = 0;
  var maximum  = 4;
  var current  = 0;
  var results  = [];
  var myError  = null;

  if (options.parallel === 0) {
    maximum = array.length;
  }

  if (options.parallel && options.parallel > 0) {
    maximum = options.parallel;
  }

  function update() {
    if (myError || working >= maximum || current >= array.length) {
      return false;
    }
    working += 1;

    var args = [ array[current] ];

    if (perform.length >= 3) {
      args.push(current);
    }

    args.push(
      (function (index) {
        return function (error, value) {
          working -= 1;
          pending -= 1;
          if (error) {
            if (!myError) {
              myError = error;
            }
          } else {
            results[index] = value;
          }
          if (working === 0 && myError) {
            return deferred.reject(myError);
          }
          if (!myError) {
            if (pending === 0) {
              deferred.resolve(results);
            } else {
              // run as much tasks as possible
              while (update());
            }
          }
        };
      })(current)
    );

    perform.apply({}, args);
    current += 1;
    return true;
  }

  // run as much tasks as possible
  while (update());

  return deferred.promise();
}
