// https://tools.ietf.org/html/rfc6902

import * as jsonpatch from 'fast-json-patch';

const src = {
    a: 1,
    b: 2,
    c: [3]
};

const target = {
    a: 2,
    c: [3,4],
    d: 5
};

const patch = jsonpatch.compare(src, target);

console.log(patch);





const patchedSrc = jsonpatch.applyPatch(src, patch).newDocument;
console.log(patchedSrc);

const observer = jsonpatch.observe(patchedSrc);
patchedSrc.a = 10;
patchedSrc.c.push(42);

const patch2 = jsonpatch.generate(observer);
console.log(patch2);

const x = jsonpatch.applyPatch({c: [], a: 3}, patch2).newDocument;

console.log(x);
