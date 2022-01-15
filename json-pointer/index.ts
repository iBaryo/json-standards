// https://tools.ietf.org/html/rfc6901
// easier read: https://gregsdennis.github.io/Manatee.Json/usage/pointer.htmls

import {VersionParser} from "./VersionParser";

interface MyOldObject {
    a: string;
    b: {
        d: {
            oldE: string;
        }
    }
}

interface MyObject {
    a: string;
    b: {
        c: symbol;
        d: {
            e: boolean;
            f: {
                g: number;
                h: string[];
                i: number[];
                j: string[][];
            }
        }
    }
}

const parser = new VersionParser<MyObject>({
    defaultVersionResolver: o => o.version ?? 'v1',
    defaultValueResolver: targetPointer => null,
    mapper: {
        'v1': {
            a: '/a',
            b: {
                c: '/b/c',
                d: {
                    e: '/b/d/oldE',
                    f: {
                        g: '/x',
                        h: '/arrs/arr1',
                        i: [
                            '/arrs/arr2/0',
                            '/arrs/arr2/1'
                        ],
                        j: [
                            [
                                '/arrs/arr2/0',
                            ],
                            [
                                '/arrs/arr2/2',
                            ],
                            [
                                '/doesNotExist'
                            ]
                        ]
                    }
                }
            }
        }
    }
});

console.log(
    JSON.stringify(
        parser.transform({
            version: undefined,
            a: 1,
            b: {
                c: 2,
                d: {
                    oldE: 3,
                    shouldIgnore: 999,
                }
            },
            x: 'woo',
            arrs: {
                arr1: ['1', '2', '3'],
                arr2: [4, 5, 6]
            }
        })
        , undefined, 4)
);
