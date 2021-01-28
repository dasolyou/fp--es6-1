const L = {};

const curry = f => (a, ..._) =>_.length ? f(a, ..._) : (..._) => f(a, ..._);

// map(조건/key함수, iterator)
const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a)); 
  }
  return res; 
})

// filter(조건함수, iterator)
const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }  
  return res;
})

// reduce(reduce하려는 함수, 초기값, iterator)
const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  } 
  return acc;
})

const go = curry((...args) => reduce((a, f) => f(a), args)); 
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    // console.log(i, 'range');
    res.push(i);
  }
  return res;
};

const take = curry((l, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});