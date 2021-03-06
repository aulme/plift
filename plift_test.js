const R = require('ramda');
const expect = require('chai')
  .use(require('chai-as-promised'))
  .expect;

const plift = require('./plift');

describe("lifting functions to work with promisses", () => {
  const liftedAdd = plift(R.add);

  it("should lift simple functions", () => {
    return expect(liftedAdd(Promise.resolve(1), Promise.resolve(2)))
      .to.eventually.equal(3);
  });

  it("should lift mixed inputs functions", () => {
    return expect(liftedAdd(Promise.resolve(1), 2))
      .to.eventually.equal(3);
  });

  it("should leave callbacks alone", () => {
    const liftedMap = plift(R.map);
    return expect(liftedMap(R.add(5), Promise.resolve([1, 2, 3])))
      .to.become([6, 7, 8]);
  });

  it("should not loose arity of lifted functions", () => {
    const fn = (a, b, c) => a + b + c;
    expect(plift(fn).length).to.equal(3);
  });

  it("should plift all functions in an object", () => {
    const LR = plift(R);
    return expect(LR.add(4, Promise.resolve(10))).to.become(14);
  });

  it("should plift all deeply nested functions in an object", () => {
    const util = {
      math: {
        add: (x, y) => x + y
      }
    }
    const putil = plift(util);
    return expect(putil.math.add(4, Promise.resolve(10))).to.become(14);
  });

  it("flattens resulting nestings of promisses in collections", () => {
    const LR = plift(R);
    const add5All = LR.map(LR.add(5));
    const mapped = add5All(Promise.resolve([1, 2, 3]));
    return expect(mapped).to.become([6, 7, 8]);
  });

  it("flattens resulting nestings of promisses in objects", () => {
    const LR = plift(R);
    const add5All = LR.map(LR.add(5));
    const mapped = add5All(Promise.resolve({a: 1, b: 2}));
    return expect(mapped).to.become({a: 6, b: 7});
  });
});
