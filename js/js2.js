const log = console.log;

const curry = f =>
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const isiterable = a => a && a[Symbol.iterator];

const go2 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }

  // 중간에 프로미스를 만나도 프로미스가 아닐 때는 동기적으로 계속해서 while문을 통해 넘어갈 수 있도록 구성하는 것이 좋음

  // let cur;
  // while (!(cur = iter.next()).done) {
  //   const a = cur.value;
  //   acc = acc instanceof Promise ? acc.then (acc => f(acc, a)) : f(acc, a);
  //   // acc = f(acc, a);
  // }
  // return acc;

  // 위의 로직보다 재귀를 이용하는 것이 좋음
  return go2(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      acc = f(acc, a);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});
// const reduce = curry((f, acc, iter) => {
//   if (!iter) {
//     iter = acc[Symbol.iterator]();
//     acc = iter.next().value;
//   } else {
//     iter = iter[Symbol.iterator]();
//   }
//   let cur;
//   while (!(cur = iter.next()).done) {
//     const a = cur.value;
//     acc = f(acc, a);
//   }
//   return acc;
// });

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});

const takeAll = take(Infinity);

const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) yield i;
};

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

var add = (a, b) => a + b;

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};
