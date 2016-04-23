const R = require('ramda');

const promiseAll = x => Promise.all(x);
const promiseAllObj = obj => {
  return promiseAll(R.map(promiseAll, R.toPairs(obj)))
    .then(promiseAll)
    .then(R.fromPairs);
};

const isFunction = fn => fn && typeof(fn) === 'function';
const isObject = obj => obj &&  obj instanceof Object && !Array.isArray(obj);

function pliftFunction (fn) {
  return R.curryN(fn.length, function () {
    return Promise.all(arguments)
    .then(args => fn.apply(null, args))
    .then(R.when(Array.isArray, promiseAll))
    .then(R.when(isObject, promiseAllObj));
  });
}

const mapObj = (fn, obj) => Object.keys(obj).reduce((acc, curr) => {
    acc[curr] = fn(obj[curr]);
    return acc;
}, {});

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
