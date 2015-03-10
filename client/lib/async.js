/**
 * Transform an array into a set of asynchronous jobs to be
 * performed in parallel.
 *
 * @param   {Array}    array - the array to be transformed
 * @param   {Object}   options - an object containing options
 * @param   {Number}   options.parallel - the maximum number of jobs that can run in parallel, if zero is passed, there will be no restriction
 * @param   {Function} transform - a function to be called for each element of array; it will receive: element, index (optional) and callback
 * @returns {Object}   a promise which will be resolved or rejected when all jobs are done
 */
App.all = function (array, options, transform) {
  "use strict";

  if (typeof options === 'function') {
    transform = options; options = {};
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

    if (transform.length >= 3) {
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

    transform.apply({}, args);
    current += 1;
    return true;
  }

  // run as much tasks as possible
  while (update());

  return deferred.promise();
}
