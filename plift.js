const R = require('ramda');

function pliftFunction (fn) {
  return R.curryN(fn.length, function () {
    return Promise.all(arguments)
    .then(args => fn.apply(null, args));
  });
}

const isFunction = fn => fn && typeof(fn) === 'function';
const isObject = obj => obj instanceof Object;

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
