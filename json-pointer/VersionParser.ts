import * as JsonPointer from "json-pointer";

export type JSONPointer = `/${string}`;
export type Version = string;
export type VersionResolver<V extends Version, SRC = any> =
    (keyof SRC) | ((o: SRC) => V);

export type PointerMap<O> = JSONPointer |
    (O extends Array<infer R>
        ? Array<PointerMap<R>>
        : O extends object
            ? { [K in keyof O]: PointerMap<O[K]> }
            : JSONPointer);

export class VersionParser<TARGET, V extends Version = Version> {
    constructor(private readonly options: {
        mapper: {
            [version in V]: PointerMap<TARGET>
        },
        defaultVersionResolver?: VersionResolver<V>,
        defaultValueResolver?: (targetPointer: JSONPointer) => any
    }) {
    }

    public transform<SRC>(o: SRC, versionResolver?: VersionResolver<V, SRC>): TARGET {
        const vResolver: VersionResolver<V> =
            versionResolver ?? this.options.defaultVersionResolver;

        const version =
            typeof vResolver == 'function' ? vResolver(o) : o[vResolver];

        if (!version)
            throw `couldn't resolve version in: ${JSON.stringify(o)}`;

        const pointerMap = this.options.mapper[version];

        if (!pointerMap)
            throw `version ${version} is not supported`;

        return generateFromSource<TARGET>(o, pointerMap, this.options.defaultValueResolver);
    }
}

export function generateFromSource<TARGET>(
    src: any,
    pointers: PointerMap<TARGET>,
    defaultValResolver?: (curPointer: JSONPointer) => any,
    curPointer: JSONPointer = '/'): TARGET {

    if (pointers instanceof Array) {
        return pointers.map(
            (pointer, i) =>
                generateFromSource(
                    src,
                    pointer,
                    defaultValResolver,
                    addToPointer(curPointer, i.toString())
                )) as unknown as TARGET;

    } else if (typeof pointers == 'object') {
        return Object.entries(pointers).reduce((res, [k, pointer]) => {
            res[k] =
                generateFromSource(
                    src,
                    pointer as PointerMap<TARGET[keyof TARGET]>,
                    defaultValResolver,
                    addToPointer(curPointer, k));

            return res;
        }, {} as TARGET);
    } else if (!defaultValResolver || JsonPointer.has(src, pointers)) {
        return JsonPointer.get(src, pointers);
    } else {
        return defaultValResolver(curPointer);
    }
}

function addToPointer(cur: JSONPointer, ...tokens: string[]) {
    return JsonPointer.compile([
        ...JsonPointer.parse(cur.length == 1 ? '' : cur),
        ...tokens
    ]) as string as JSONPointer;
}
