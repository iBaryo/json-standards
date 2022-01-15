// https://json-schema.org/learn/


import {VersionParser} from "../json-pointer/VersionParser";
import {forSchema} from "./SchemaDefaultResolver";
import {JSONSchema7} from "json-schema";
import Ajv from "ajv";

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

const schema: JSONSchema7 = {
    type: 'object',
    properties: {
        a: {type: 'string'},
        b: {
            type: 'object',
            properties: {
                c: {
                    type: 'number',
                },
                d: {
                    type: 'object',
                    properties: {
                        e: {type: 'boolean'},
                        f: {
                            type: 'object',
                            properties: {
                                g: {type: 'string'},
                                h: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                },
                                i: {
                                    type: 'array',
                                    items: {
                                        type: 'number'
                                    }
                                },
                                j: {
                                    type: 'array',
                                    items: {
                                        type: 'array',
                                        items: {
                                            type: 'number',
                                            default: 42
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const schemaResolver = forSchema(schema);
const parser = new VersionParser<MyObject>({
    defaultVersionResolver: o => o.version ?? 'v1',
    defaultValueResolver: targetPointer => schemaResolver.find(targetPointer)?.default,
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

const o = parser.transform({
    version: undefined,
    a: '1',
    b: {
        c: 2,
        d: {
            oldE: true,
            shouldIgnore: 999,
        }
    },
    x: 'woo',
    arrs: {
        arr1: ['1', '2', '3'],
        arr2: [4, 5, 6]
    }
});

const validate = new Ajv().compile(schema);

console.log(
    validate(o),
    JSON.stringify(o, undefined, 4)
);
