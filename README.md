# Plift - use promises as values
Inspired by and intended to work well with [Ramda.js](http://ramdajs.com/).

## Usage
A plifted function can be invoked with any combination of promises and values in its parameters. Plifted functions always return promises, even if all arguments are values.

```javascript
const plift = require('plift');
const add = plift((a, b, c) => a + b + c);
const log = plift(console.log);

const sum = add(1, 2, 3);

sum.then(console.log); // 6
log(sum); // 6

const sum2 = add(Promise.resolve(1), 2, Promise.resolve(3));
log(sum2); // 6
```
Plifted functions are curried by default. If you don't know what currying is and why it is useful, [here's an intro](https://hughfdjackson.com/javascript/why-curry-helps/).

```javascript
const add3 = add(1, 2);
const sum3 = add3(Promise.resolve(10));
log(sum3); // 13
```

This allows you to treat async values as first-class citizens instead of forcing your code into an endless pipe of `then`s.

```javascript
const remoteValue = Promise.resolve(5);
const remoteValue2 = Promise.resolve(10);

const add = plift((a, b) => a + b);
const multiply = plift((a, b) => a * b);

const added = add(1, remoteValue);
const multiplied = multiply(added, remoteValue2);

log(multiplied);
```

## Installation
In terminal:
```bash
npm install plift
```

Then in code or in node repl:
```javascript
const plift = require('plift');
```

## License
MIT
