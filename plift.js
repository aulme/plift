const R = require('ramda');

const plift = function (fn) {
  return R.curryN(fn.length, function () {
    return Promise.all(arguments)
    .then(R.apply(fn));
  });
}

module.exports = plift;
