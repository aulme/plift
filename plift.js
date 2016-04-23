const R = require('ramda');

function promiseAll (x) {
  return Promise.all(x);
}

function promiseAllObj (obj) {
  return promiseAll(R.map(promiseAll, R.toPairs(obj)))
    .then(promiseAll)
    .then(R.fromPairs);
}

function isFunction (fn) {
  return fn && typeof(fn) === 'function';
}

function isObject (obj) {
  return obj &&  obj instanceof Object && !Array.isArray(obj);
}

function pliftFunction (fn) {
  return R.curryN(fn.length, function () {
    return Promise.all(arguments)
      .then(function(args) {
        return fn.apply(null, args);
      })
      .then(R.when(Array.isArray, promiseAll))
      .then(R.when(isObject, promiseAllObj));
  });
}

function mapObj (fn, obj) {
  return Object.keys(obj).reduce(function (acc, curr) {
    acc[curr] = fn(obj[curr]);
    return acc;
  }, {});
}

function plift (obj) {
  if(isFunction(obj)) {
    return pliftFunction(obj);
  }

  if(isObject(obj)) {
    return mapObj(plift, obj);
  }

  return obj;
}

module.exports = plift;
