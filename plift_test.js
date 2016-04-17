const R = require('ramda');
const expect = require('chai').use(require('chai-as-promised')).expect;

const plift = function (fn) {
  return R.curryN(fn.length, function () {
     return Promise.all(arguments)
      .then(R.apply(fn));
  });
 }

describe("lifting functions to work with promisses", () => {
  const liftedAdd = plift(R.add);

  it("should lift simple functions", () => {
    return expect(liftedAdd(Promise.resolve(1), Promise.resolve(2)))
      .to.eventually.equal(3);
  });

  it("should lift mixed inputs", () => {
    return expect(liftedAdd(Promise.resolve(1), 2))
      .to.eventually.equal(3);
  });

  it("should leave callbacks alone", () => {
    const liftedMap = plift(R.map);
    return expect(liftedMap(R.add(5), Promise.resolve([1, 2, 3])))
      .to.become([6, 7, 8]);
  });

  it("should not loose arity of lifted functions", () => {
    const fn = (a, b) => a + b;
    expect(plift(fn).length).to.equal(2);
  });
});
